// ./SimpleTextArea/ScreenshotModal.tsx

import React, { useState } from "react";
import Modal from "react-modal";

interface ScreenshotModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  imageSrc: string;
}

const ScreenshotModal: React.FC<ScreenshotModalProps> = ({ isOpen, onRequestClose, imageSrc }) => {
  const [background, setBackground] = useState<'black' | 'white' | 'transparent'>('black');

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageSrc;
    link.download = "screenshot.png";
    link.click();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      ariaHideApp={false} // Consider setting this to true and defining the app element for accessibility
      style={{
        content: {
          width: '80%', // Adjusted to be responsive
          maxWidth: '800px',
          height: '54vh', // Reduced height by 40%
          maxHeight: '54vh', // Reduced max height by 40%
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center', // Center vertically
          padding: '20px',
          backgroundColor: '#333',
          borderRadius: '10px',
          border: 'none',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)', // Center horizontally and vertically
          overflow: 'auto',
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.75)', // Solid, dimmed background
          zIndex: 1000, // Ensure it's above other elements
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
      }}
    >
      {/* Image Section */}
      <div
        className="image-container"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: background === 'transparent' ? 'transparent' : background,
          flex: '1 1 auto',
          height: '100%', // Ensure full height
        }}
      >
        <img
          src={imageSrc}
          alt="Screenshot"
          style={{
            maxHeight: '100%',
            maxWidth: '100%',
            objectFit: "contain",
            borderRadius: '5px',
          }}
        />
      </div>

      {/* Controls Section */}
      <div
        className="controls-container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center', // Center controls vertically
          marginLeft: '20px',
          flex: '0 0 200px', // Fixed width for controls
          height: '100%', // Ensure full height
        }}
      >
        {/* Background Selector */}
        <div className="mb-4" style={{ width: '100%' }}>
          <label htmlFor="background-select" className="mr-2 text-white block mb-2">Background:</label>
          <select
            id="background-select"
            value={background}
            onChange={(e) => setBackground(e.target.value as 'black' | 'white' | 'transparent')}
            className="p-2 border rounded bg-gray-800 text-white w-full"
          >
            <option value="black">Black</option>
            <option value="white">White</option>
            <option value="transparent">Transparent</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex flex-col space-y-2" style={{ width: '100%' }}>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-full"
          >
            Download
          </button>
          <button
            onClick={onRequestClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 w-full"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ScreenshotModal;