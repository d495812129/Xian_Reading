"use client";

import { useState } from "react";
import { Download, Copy, Check, ExternalLink } from "lucide-react";

export default function DownloadButton({
  panLink,
  panPassword,
}: {
  panLink: string;
  panPassword?: string | null;
}) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    window.open(panLink, "_blank", "noopener,noreferrer");
    setRevealed(true);
  };

  const copyPassword = () => {
    if (panPassword) {
      navigator.clipboard.writeText(panPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div>
      {!revealed ? (
        <button
          onClick={handleClick}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition text-base font-medium"
        >
          <Download className="w-5 h-5" />
          立即下载
        </button>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-green-600">
            <Check className="w-4 h-4" />
            已打开百度网盘，请输入提取码保存
          </div>
          {panPassword && (
            <div className="flex items-center gap-2 p-3 bg-stone-50 rounded-lg border border-stone-200">
              <span className="text-sm text-stone-500">提取码：</span>
              <code className="px-3 py-1 bg-white rounded font-mono text-base font-bold tracking-wider border border-stone-200">
                {panPassword}
              </code>
              <button
                onClick={copyPassword}
                className="ml-auto inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-stone-800 text-white rounded-md hover:bg-stone-700 transition"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    已复制
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    复制
                  </>
                )}
              </button>
            </div>
          )}
          <a
            href={panLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-stone-400 hover:text-stone-600 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            重新打开网盘
          </a>
        </div>
      )}
    </div>
  );
}
