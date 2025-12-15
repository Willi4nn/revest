import { useCallback, useMemo, useState } from 'react';
import { ApiKeyGate } from './components/auth/ApiKeyGate';
import { AppHeader } from './components/layout/AppHeader';
import { HeroSection } from './components/layout/HeroSection';
import { ResultView } from './components/results/ResultView';
import { Spinner } from './components/ui/Spinner';
import { MobileGeneratePrompt } from './components/upload/MobileGeneratePrompt';
import { UploadSection } from './components/upload/UploadSection';
import { useGeminiKey } from './hooks/useGeminiKey';
import { generateReupholstery } from './services/gemini.service';
import { ProcessingState, type UploadedImage, type UploadSectionItem } from './types';

function App() {
  const { hasApiKey, isChecking, errorMsg, setErrorMsg, connectKey } = useGeminiKey();

  const [furnitureImage, setFurnitureImage] = useState<UploadedImage | null>(null);
  const [textureImage, setTextureImage] = useState<UploadedImage | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<ProcessingState>(ProcessingState.IDLE);

  const handleFurnitureSelect = useCallback((image: UploadedImage) => setFurnitureImage(image), []);
  const handleTextureSelect = useCallback((image: UploadedImage) => setTextureImage(image), []);
  const clearFurniture = useCallback(() => setFurnitureImage(null), []);
  const clearTexture = useCallback(() => setTextureImage(null), []);

  const handleGenerate = useCallback(async () => {
    if (!furnitureImage || !textureImage) return;

    setStatus(ProcessingState.GENERATING);
    setErrorMsg(null);

    try {

      const generatedImage = await generateReupholstery(
        furnitureImage.base64,
        textureImage.base64,
        furnitureImage.width,
        furnitureImage.height
      );

      setResultUrl(generatedImage);
      setStatus(ProcessingState.SUCCESS);
    } catch (error) {
      console.error('Generation failed', error);
      setStatus(ProcessingState.ERROR);

      const message = error instanceof Error ? error.message : 'Algo deu errado durante a geração.';

      if (message.includes('PERMISSION_DENIED') || message.includes('403')) {
        setErrorMsg("Erro de permissão. Verifique o faturamento no Google Cloud.");
      } else {
        setErrorMsg(message);
      }
    }
  }, [furnitureImage, textureImage, setErrorMsg]);

  const handleReset = useCallback(() => {
    setFurnitureImage(null);
    setTextureImage(null);
    setResultUrl(null);
    setStatus(ProcessingState.IDLE);
    setErrorMsg(null);
  }, [setErrorMsg]);

  const scrollToUploadSection = useCallback(() => {
    document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const uploadSections: UploadSectionItem[] = useMemo(() => [
    {
      id: 'furniture-upload',
      step: 'Passo 1',
      title: 'Foto do Móvel',
      description: 'Use uma foto bem iluminada.',
      subLabel: 'JPG, PNG',
      image: furnitureImage,
      onImageSelect: handleFurnitureSelect,
      onClear: clearFurniture,
    },
    {
      id: 'texture-upload',
      step: 'Passo 2',
      title: 'Amostra do Tecido',
      description: 'Close do padrão do tecido.',
      subLabel: 'Textura nítida',
      image: textureImage,
      onImageSelect: handleTextureSelect,
      onClear: clearTexture,
    },
  ], [furnitureImage, textureImage, handleFurnitureSelect, handleTextureSelect, clearFurniture, clearTexture]);

  const isGenerating = status === ProcessingState.GENERATING;
  const canGenerate = Boolean(furnitureImage && textureImage);
  const showResultView = status === ProcessingState.SUCCESS && Boolean(resultUrl && furnitureImage);
  const furniturePreviewUrl = furnitureImage?.previewUrl ?? '';
  const resultImageUrl = resultUrl ?? '';

  if (isChecking) return <Spinner label="Iniciando..." />;

  if (!hasApiKey) return <ApiKeyGate errorMessage={errorMsg} onConnect={connectKey} />;

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-50 selection:bg-indigo-500/30 flex flex-col">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      <AppHeader />

      <main className="flex-1 flex flex-col relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 gap-8 pb-32 md:pb-8">
        <HeroSection onPrimaryAction={scrollToUploadSection} isResultView={showResultView} />

        {showResultView ? (
          <ResultView
            originalImage={furniturePreviewUrl}
            resultImage={resultImageUrl}
            onReset={handleReset}
          />
        ) : (
          <UploadSection
            sections={uploadSections}
            canGenerate={canGenerate}
            isGenerating={isGenerating}
            status={status}
            errorMessage={errorMsg}
            onGenerate={handleGenerate}
          />
        )}
      </main>

      <MobileGeneratePrompt
        visible={!showResultView}
        canGenerate={canGenerate}
        isGenerating={isGenerating}
        onGenerate={handleGenerate}
      />
    </div>
  );
}

export default App;