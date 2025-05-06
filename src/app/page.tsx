"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [accessories, setAccessories] = useState("");
  const [clothingStyle, setClothingStyle] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewExpanded, setPreviewExpanded] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePreview = () => {
    setPreviewExpanded(!previewExpanded);
  };

  const generateDoll = async () => {
    if (!name || !description || !uploadedImage) {
      alert("Пожалуйста, заполните все поля и загрузите изображение");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: uploadedImage,
          name,
          description,
          accessories,
          clothingStyle
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Не удалось сгенерировать изображение");
      }

      const data = await response.json();
      setGeneratedImage(data.imageUrl);
    } catch (error) {
      console.error("Ошибка генерации изображения:", error);
      setError(error instanceof Error ? error.message : "Не удалось сгенерировать изображение. Пожалуйста, попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-white dark:from-pink-950 dark:to-purple-950 p-4 md:p-8">
      <main className="max-w-5xl mx-auto rounded-xl bg-white dark:bg-gray-900 shadow-lg p-6 md:p-8 border border-pink-200 dark:border-pink-800">
        <h1 className="text-3xl font-bold text-center text-pink-600 dark:text-pink-400 mb-8">
          Генератор Фигурок
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-pink-700 dark:text-pink-300">
                1. Загрузите ваше изображение
              </h2>
              
              <div className="border-2 border-dashed border-pink-300 dark:border-pink-700 rounded-lg p-4 text-center cursor-pointer hover:border-pink-500 transition">
                <input
                  type="file"
                  accept="image/*"
                  id="image-upload"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <label htmlFor="image-upload" className="cursor-pointer block">
                  <div className="flex flex-col items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-pink-400 mb-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-sm text-pink-500 dark:text-pink-300">
                      Нажмите, чтобы загрузить фото
                    </p>
                  </div>
                </label>
              </div>

              {uploadedImage && (
                <div 
                  className="md:hidden mt-4 rounded-md overflow-hidden cursor-pointer"
                  onClick={togglePreview}
                >
                  <p className="text-sm text-pink-600 dark:text-pink-400 mb-2 text-center">
                    {previewExpanded ? "Нажмите, чтобы свернуть" : "Нажмите, чтобы развернуть превью"}
                  </p>
                  <div className={`transition-all duration-300 ease-in-out relative ${previewExpanded ? "h-64" : "h-16"} w-full`}>
                    <Image
                      src={uploadedImage}
                      alt="Загруженное изображение"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-pink-700 dark:text-pink-300">
                2. Введите детали фигурки
              </h2>
              <div className="space-y-3">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-pink-700 dark:text-pink-300 mb-1"
                  >
                    Имя (будет указано на коробке)
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Герой действия"
                    className="w-full px-3 py-2 border border-pink-300 dark:border-pink-700 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-pink-700 dark:text-pink-300 mb-1"
                  >
                    Описание
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Легендарный герой с необычными способностями"
                    rows={3}
                    className="w-full px-3 py-2 border border-pink-300 dark:border-pink-700 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="accessories"
                    className="block text-sm font-medium text-pink-700 dark:text-pink-300 mb-1"
                  >
                    Аксессуары
                  </label>
                  <input
                    type="text"
                    id="accessories"
                    value={accessories}
                    onChange={(e) => setAccessories(e.target.value)}
                    placeholder="Меч, щит, гаджеты и т.д."
                    className="w-full px-3 py-2 border border-pink-300 dark:border-pink-700 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="clothingStyle"
                    className="block text-sm font-medium text-pink-700 dark:text-pink-300 mb-1"
                  >
                    Стиль одежды
                  </label>
                  <input
                    type="text"
                    id="clothingStyle"
                    value={clothingStyle}
                    onChange={(e) => setClothingStyle(e.target.value)}
                    placeholder="Футуристический, повседневный, средневековый, супергеройский и т.д."
                    className="w-full px-3 py-2 border border-pink-300 dark:border-pink-700 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={generateDoll}
              disabled={loading}
              className={`w-full py-3 px-4 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-md shadow transition-colors disabled:cursor-not-allowed ${
                loading ? "animate-pulse shadow-lg shadow-pink-500/50" : "disabled:bg-pink-300"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin mr-3"></div>
                  Создание...
                </span>
              ) : (
                "Создать фигурку"
              )}
            </button>
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}
          </div>

          <div className="flex flex-col items-center justify-start bg-pink-50 dark:bg-gray-800 rounded-lg p-4 relative min-h-[400px] border border-pink-200 dark:border-pink-800">
            <div className="sticky top-4 w-full">
              {uploadedImage && !generatedImage && (
                <div className="hidden md:block">
                  <h3 className="text-base font-medium text-pink-700 dark:text-pink-300 mb-2">
                    Загруженное изображение:
                  </h3>
                  <div className="relative w-full aspect-square max-w-[350px] mx-auto rounded-md overflow-hidden mb-4 border border-pink-200 dark:border-pink-700">
                    <Image
                      src={uploadedImage}
                      alt="Загруженное изображение"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </div>
              )}

              {generatedImage && (
                <div className={`transition-all duration-500 ${loading ? "opacity-50" : "opacity-100"}`}>
                  <h3 className="text-base font-medium text-pink-700 dark:text-pink-300 mb-2">
                    Сгенерированная фигурка:
                  </h3>
                  <div className={`relative w-full aspect-square max-w-[400px] mx-auto rounded-md overflow-hidden shadow-xl ${
                    loading ? "animate-pulse shadow-lg shadow-pink-500/50" : ""
                  }`}>
                    <Image
                      src={generatedImage}
                      alt="Сгенерированная фигурка"
                      fill
                      style={{ objectFit: "contain" }}
                      className="bg-white"
                    />
                  </div>
                  <a
                    href={generatedImage}
                    download="action-figure.png"
                    className="mt-4 mx-auto block text-center py-2 px-4 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-md font-medium hover:bg-pink-200 dark:hover:bg-pink-800/30 transition-colors"
                  >
                    Скачать изображение
                  </a>
                </div>
              )}

              {!uploadedImage && !generatedImage && (
                <div className="text-center mt-16">
                  <p className="text-pink-500 dark:text-pink-400 mb-2">
                    Загрузите изображение, чтобы создать вашу фигурку
                  </p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-pink-300 dark:text-pink-700 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}

              {loading && (
                <div className="absolute inset-0 bg-pink-500/10 dark:bg-pink-500/20 backdrop-blur-[1px] rounded-lg flex items-center justify-center">
                  <div className="p-6 rounded-lg flex flex-col items-center animate-pulse">
                    <div className="w-12 h-12 border-4 border-pink-600 dark:border-pink-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-pink-700 dark:text-pink-300 font-medium text-lg animate-pulse">
                      Создаем вашу фигурку...
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <footer className="text-center mt-8 text-sm text-pink-600 dark:text-pink-400">
        © {new Date().getFullYear()} Генератор Фигурок • Работает на Segmind API
      </footer>
    </div>
  );
}
