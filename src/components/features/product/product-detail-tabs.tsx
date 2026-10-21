'use client';

import { useState } from 'react';
import type { ProductSpec } from '@/lib/utils/product';

interface ProductDetailTabsProps {
  name: string;
  specs: ProductSpec[];
  congDung?: string | null;
  applicationsHtml?: string | null;
  whyHtml?: string | null;
}

type TabId = 'mo-ta' | 'ung-dung' | 'vi-sao';

const TABS: { id: TabId; label: string }[] = [
  { id: 'mo-ta', label: 'Mô tả chi tiết' },
  { id: 'ung-dung', label: 'Ứng dụng chi tiết' },
  { id: 'vi-sao', label: 'Vì sao nên sử dụng sản phẩm?' },
];

const RICH_TEXT_CLASS =
  'text-[15px] leading-relaxed text-gray-700 ' +
  '[&_p]:mb-4 [&_p:last-child]:mb-0 ' +
  '[&_h2]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-900 ' +
  '[&_h3]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-gray-900 ' +
  '[&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-2 ' +
  '[&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 ' +
  '[&_a]:text-[#0c5c36] [&_a]:underline ' +
  '[&_strong]:font-semibold';

function Fallback({ children }: { children: string }) {
  return <p className="text-[15px] text-gray-500">{children}</p>;
}

export function ProductDetailTabs({
  name,
  specs,
  congDung,
  applicationsHtml,
  whyHtml,
}: ProductDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>(
    applicationsHtml ? 'ung-dung' : 'mo-ta'
  );

  return (
    <section aria-label={`Thông tin chi tiết ${name}`}>
      <div
        role="tablist"
        aria-label="Thông tin sản phẩm"
        className="flex gap-2 overflow-x-auto"
      >
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 whitespace-nowrap rounded-t-lg border border-b-0 px-4 py-3 text-[13px] font-bold transition-colors sm:px-5 sm:text-[14px] ${
                isActive
                  ? 'border-[#0c5c36] bg-[#0c5c36] text-white'
                  : 'border-gray-200 bg-white text-[#0c5c36] hover:bg-[#f4f9f5]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="min-h-[340px] rounded-b-lg rounded-tr-lg border border-gray-200 bg-white p-5 sm:p-8">
        {activeTab === 'mo-ta' && (
          <div
            role="tabpanel"
            id="panel-mo-ta"
            aria-labelledby="tab-mo-ta"
            className="space-y-5"
          >
            {congDung && (
              <p className="text-[15px] leading-relaxed text-gray-700">
                {congDung}
              </p>
            )}

            {specs.length > 0 && (
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full text-[14px]">
                  <tbody>
                    {specs.map((spec, index) => (
                      <tr
                        key={spec.label}
                        className={index % 2 === 0 ? 'bg-[#fafbfc]' : 'bg-white'}
                      >
                        <th
                          scope="row"
                          className="w-1/3 border-b border-gray-100 px-4 py-3 text-left align-top font-semibold text-gray-900"
                        >
                          {spec.label}
                        </th>
                        <td className="border-b border-gray-100 px-4 py-3 align-top text-gray-700">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!congDung && specs.length === 0 && (
              <Fallback>Thông tin sản phẩm đang được cập nhật.</Fallback>
            )}
          </div>
        )}

        {activeTab === 'ung-dung' && (
          <div
            role="tabpanel"
            id="panel-ung-dung"
            aria-labelledby="tab-ung-dung"
            className={RICH_TEXT_CLASS}
          >
            {applicationsHtml ? (
              <div dangerouslySetInnerHTML={{ __html: applicationsHtml }} />
            ) : (
              <Fallback>Nội dung đang được cập nhật.</Fallback>
            )}
          </div>
        )}

        {activeTab === 'vi-sao' && (
          <div
            role="tabpanel"
            id="panel-vi-sao"
            aria-labelledby="tab-vi-sao"
            className={RICH_TEXT_CLASS}
          >
            {whyHtml ? (
              <div dangerouslySetInnerHTML={{ __html: whyHtml }} />
            ) : (
              <Fallback>Nội dung đang được cập nhật.</Fallback>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
