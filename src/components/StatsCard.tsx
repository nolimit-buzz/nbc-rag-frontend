'use client';
import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  description: string;
  backgroundColor: string;
  borderColor: string;
  badgeBackgroundColor: string;
  badgeTextColor: string;
  icon?: ReactNode;
  className?: string;
}

export default function StatsCard({
  title,
  value,
  subtitle,
  description,
  backgroundColor,
  borderColor,
  badgeBackgroundColor,
  badgeTextColor,
  icon,
  className = ''
}: StatsCardProps) {
  return (
    <div 
      className={`rounded-xl p-6 ${className}`}
      style={{ 
        background: backgroundColor, 
        border: `1px solid ${borderColor}` 
      }}
    >
      <div>
        <div 
          className="inline-block mb-4 px-4 py-1 rounded-full text-sm font-medium"
          style={{ 
            background: badgeBackgroundColor, 
            color: badgeTextColor 
          }}
        >
          {title}
        </div>
        <div className="text-4xl font-extrabold text-gray-700 mb-2">
          {value}
        </div>
        <div className="text-[14px] font-semibold text-gray-700 mb-1">
          {subtitle}
        </div>
        <div className="text-[14px] text-gray-700 text-base mt-2">
          {description}
        </div>
        {icon && (
          <div className="mt-4">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
} 