import { useCallback, useMemo, useState } from 'react';
import { Flip, ToastContainer } from 'react-toastify';
import { ApiKeyGate } from './components/auth/ApiKeyGate';
import { AppHeader } from './components/layout/AppHeader';
import { HeroSection } from './components/layout/HeroSection';
import { HistoryDrawer } from './components/results/HistoryDrawer';
import { ResultView } from './components/results/ResultView';
import { ConfirmationModal } from './components/ui/ConfirmationModal';
import { Spinner } from './components/ui/Spinner';
import { MobileGeneratePrompt } from './components/upload/MobileGeneratePrompt';
import { UploadSection } from './components/upload/UploadSection';
import { useGeminiKey } from './hooks/useGeminiKey';
import { useHistory } from './hooks/useHistory';
import { generateReupholstery } from './services/gemini.service';
import { ProcessingState, type HistoryItem, type UploadedImage, type UploadSectionItem } from './types';



function App() {
  const { hasApiKey, isChecking, errorMsg, setErrorMsg, connectKey } = useGeminiKey();

  const { history, isHistoryOpen, setIsHistoryOpen, saveToHistory, deleteHistoryItem } = useHistory();
  const [furnitureImage, setFurnitureImage] = useState<UploadedImage | null>(null);
  const [textureImage, setTextureImage] = useState<UploadedImage | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<ProcessingState>(ProcessingState.IDLE);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { removeKey } = useGeminiKey();

  const handleFurnitureSelect = useCallback((image: UploadedImage) => setFurnitureImage(image), []);
  const handleTextureSelect = useCallback((image: UploadedImage) => setTextureImage(image), []);
  const handleReset = useCallback(() => {
    setFurnitureImage(null);
    setTextureImage(null);
    setResultUrl(null);
    setStatus(ProcessingState.IDLE);
    setErrorMsg(null);
  }, [setErrorMsg]);

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

      saveToHistory({
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        originalImage: furnitureImage.base64,
        resultImage: generatedImage,
      });

    } catch (err: unknown) {
      const error = err as Error;
      const message = error.message || '';
      setStatus(ProcessingState.ERROR);
      setErrorMsg(message.includes('429') ? "Cota esgotada..." : message);
    }
  }, [furnitureImage, textureImage, setErrorMsg, saveToHistory]);

  const handleSelectHistoryItem = useCallback((item: HistoryItem) => {
    setFurnitureImage({
      id: 'restored',
      previewUrl: item.originalImage,
      base64: item.originalImage,
      width: 0, height: 0, file: null as unknown as File
    });
    setTextureImage(null);
    setResultUrl(item.resultImage);
    setStatus(ProcessingState.SUCCESS);
    setIsHistoryOpen(false);
  }, [setIsHistoryOpen]);



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
    <div className="app-container">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      <AppHeader
        onOpenHistory={() => setIsHistoryOpen(true)}
        onChangeApiKey={() => {
          setErrorMsg(null);
          setFurnitureImage(null);
          setTextureImage(null);
          setResultUrl(null);
          setStatus(ProcessingState.IDLE);
          removeKey();
        }}
        onOpenConfirmModal={() => setIsModalOpen(true)}
      />

      <main className="flex-1 flex flex-col relative w-full max-w-7xl mx-auto px-4 py-4 overflow-y-auto">
        <div className="shrink-0">
          <HeroSection onPrimaryAction={scrollToUploadSection} isResultView={showResultView} />
        </div>

        <div className="flex-1 min-h-0 flex flex-col w-full justify-start mt-4">
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
        </div>
      </main>

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        items={history}
        onSelect={handleSelectHistoryItem}
        onDelete={deleteHistoryItem}
      />

      <MobileGeneratePrompt
        visible={!showResultView}
        canGenerate={canGenerate}
        isGenerating={isGenerating}
        onGenerate={handleGenerate}
      />

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          removeKey();
          window.location.reload();
        }}
        title="Trocar API Key?"
        description="Isso encerrará sua sessão atual."
      />

      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Flip}
      />
    </div>
  );
}

export default App;