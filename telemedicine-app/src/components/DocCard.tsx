import React from 'react';

interface CardProps {
  imageUrl: string;
  name: string;
  consultationFee: number;
  onPay: () => Promise<void>;
}

const DocCard: React.FC<CardProps> = ({ imageUrl, name, consultationFee, onPay }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col border border-gray-200">
      <img src={imageUrl} alt={name} className="w-full h-32 object-cover" />
      <div className="p-4 flex-grow">
        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
        <p className="text-gray-600 text-sm">Consultation Fee: {consultationFee}</p>
      </div>
      <div className="p-4">
        <button
          onClick={onPay}
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Pay
        </button>
      </div>
    </div>
  );
};

export default DocCard;