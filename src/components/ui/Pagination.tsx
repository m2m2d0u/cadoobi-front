import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useLanguage } from '../../context/LanguageContext';

export interface PaginationProps {
  currentPage: number; // 0-indexed
  totalPages: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
  onPageSizeChange,
  className
}: PaginationProps) {
  const { t } = useLanguage();

  if (totalPages <= 1 && totalElements === 0) return null;

  const pages: (number | string)[] = [];
  
  if (totalPages <= 7) {
    for (let i = 0; i < totalPages; i++) {
        pages.push(i);
    }
  } else {
    pages.push(0);
    if (currentPage > 2) pages.push('...');
    
    let start = Math.max(1, currentPage - 1);
    let end = Math.min(totalPages - 2, currentPage + 1);
    
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }
    
    if (currentPage < totalPages - 3) pages.push('...');
    pages.push(totalPages - 1);
  }

  const startElement = currentPage * pageSize + 1;
  const endElement = Math.min((currentPage + 1) * pageSize, totalElements);

  return (
    <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-6 border-t border-outline-variant/10", className)}>
      <div className="flex items-center gap-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
        <span>
           {totalElements > 0 ? `${startElement}-${endElement} ${t('common.pagination.of')} ${totalElements}` : t('common.pagination.noResults')}
        </span>
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span>{t('common.pagination.rows')}</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-transparent border-none p-0 cursor-pointer text-primary focus:ring-0 appearance-none font-bold"
            >
              {[10, 25, 50, 100].map(size => (
                 <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="p-1.5 rounded-lg hover:bg-surface-container-high disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-on-surface-variant"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pages.map((p, i) => (
          typeof p === 'number' ? (
            <button
              key={`${i}-${p}`}
              onClick={() => onPageChange(p)}
              className={cn(
                "w-8 h-8 rounded-lg text-sm font-bold flex items-center justify-center transition-all",
                currentPage === p 
                  ? "bg-primary text-white shadow-md shadow-primary/20" 
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
              )}
            >
              {p + 1}
            </button>
          ) : (
             <div key={`${i}-dots`} className="w-8 h-8 flex items-end justify-center pb-2 text-on-surface-variant/50">
               <MoreHorizontal className="w-4 h-4" />
             </div>
          )
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className="p-1.5 rounded-lg hover:bg-surface-container-high disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-on-surface-variant"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
