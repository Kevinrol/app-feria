import React from 'react';

interface CareerCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const CareerCard: React.FC<CareerCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-gray-50 flex items-center justify-center rounded-lg text-[#005c4b] mb-6">
        {icon}
      </div>
      <h3 className="font-heading text-lg font-bold mb-3">{title}</h3>
      <p className="text-sm text-[#374151] leading-relaxed text-left">
        {description}
      </p>
    </div>
  );
};
