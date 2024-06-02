import React, { useState } from 'react';

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const apiKey = "sk-newkey-MSxGOusSqJBXO83rAZZPT3BlbkFJNXqXYHp61fl8Uzypz6pH";

  const generateImage = async (prompt) => {
    const methods = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        "model": "dall-e-3",
        "prompt": prompt,
        "n": 1,
        "size": "1024x1024"
      })
    };
    try {
      const result = await fetch("https://api.openai.com/v1/images/generations", methods);
      if (!result.ok) {
        const errorData = await result.json();
        throw new Error(errorData.error.message);
      }
      const data = await result.json();
      return data.data.map(item => item.url);
    } catch (error) {
      throw error;
    }
  }

  const handleGenerateImage = async () => {
    setLoading(true);
    setError('');
    try {
      const urls = await generateImage(prompt);
      setImageUrls(urls);
    } catch (error) {
      console.error('Error generating image:', error);
      setError(error.message === "Billing hard limit has been reached"
        ? "You've reached your billing limit. Please check your OpenAI account and adjust your limit if necessary."
        : error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#13160a] p-4">
      <h1 className="text-2xl font-bold mb-4 text-white">Image Generator</h1>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter a prompt"
        className="border outline-none border-gray-300 bg-[#13160a] p-2 rounded mb-4 w-full max-w-md text-white"
        // Use onKeyDown for a more responsive user experience
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleGenerateImage(e.target.value); // Call the handleGenerateImage function
          }
        }}
      />
      <button
        onClick={handleGenerateImage}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {loading ? 'Generating...' : 'Generate'}
      </button>
      {error && (
        <div className="mt-4 text-red-500">
          {error}
        </div>
      )}
      {imageUrls.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Generated Images</h2>
          <div className="grid grid-cols-2 gap-4">
            {imageUrls.map((url, index) => (
              <img key={index} src={url} alt={`Generated ${index}`} className="w-full border border-gray-300 rounded" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;
