import React, { useState } from 'react';
import { 
  Megaphone, 
  Copy, 
  Check, 
  Share2, 
  Volume2, 
  VolumeX, 
  Globe2, 
  ShieldCheck, 
  Radio, 
  ListChecks, 
  FileText 
} from 'lucide-react';
import { CommunicationResult } from '../types';

interface CommunicationPageProps {
  communication: CommunicationResult;
  disasterType: string;
  location: string;
}

export const CommunicationPage: React.FC<CommunicationPageProps> = ({
  communication,
  disasterType,
  location
}) => {
  const [copiedEnglish, setCopiedEnglish] = useState(false);
  const [copiedTelugu, setCopiedTelugu] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const handleCopy = (text: string, isEnglish: boolean) => {
    navigator.clipboard.writeText(text);
    if (isEnglish) {
      setCopiedEnglish(true);
      setTimeout(() => setCopiedEnglish(false), 2000);
    } else {
      setCopiedTelugu(true);
      setTimeout(() => setCopiedTelugu(false), 2000);
    }
  };

  const handleVoiceAlert = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported by your browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(communication.alert_english);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsPlayingAudio(false);
    };
    utterance.onerror = () => {
      setIsPlayingAudio(false);
    };

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleShare = async () => {
    const textToShare = `${communication.alert_english}\n\n[Telugu]:\n${communication.alert_telugu}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `EMERGENCY ALERT: ${disasterType} in ${location}`,
          text: textToShare,
        });
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2500);
      } catch (err) {
        // User cancelled or not supported
      }
    } else {
      navigator.clipboard.writeText(textToShare);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2500);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-rose-500 font-mono text-xs font-bold uppercase tracking-wider">
            <Megaphone className="w-4 h-4" />
            Screen 7 — Emergency Communications & CAP Alerts
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            Bilingual Emergency Broadcast Hub
          </h1>
          <p className="text-sm text-slate-400">
            Synthesized by the Communication Agent in English and Telugu (తెలుగు) for sirens, public radio, and cell broadcast.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleVoiceAlert}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              isPlayingAudio
                ? 'bg-amber-600 text-white animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span>Stop Voice Alert</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span>🔊 Voice Alert</span>
              </>
            )}
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-rose-600 hover:bg-rose-500 text-white transition-all cursor-pointer shadow-md shadow-rose-950"
          >
            {shareSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Shared / Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Share Broadcast</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2-Column Bilingual Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* English Alert */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-4 shadow-xl">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-cyan-400" />
                <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono">
                  English Emergency Alert
                </h2>
              </div>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800">
                CAP STANDARD
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 text-sm font-mono text-slate-100 leading-relaxed min-h-[140px] flex items-center">
              "{communication.alert_english}"
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-mono">
              Ready for Cell Broadcast SMS
            </span>
            <button
              onClick={() => handleCopy(communication.alert_english, true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              {copiedEnglish ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy English Alert</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Telugu Alert */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-4 shadow-xl">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono">
                  తెలుగు అత్యవసర హెచ్చరిక (Telugu)
                </h2>
              </div>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800">
                REGIONAL BROADCAST
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 text-sm font-sans text-amber-100 leading-relaxed min-h-[140px] flex items-center">
              "{communication.alert_telugu}"
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-mono">
              ఆంధ్రప్రదేశ్ & తెలంగాణ నెట్‌వర్క్‌ల కోసం
            </span>
            <button
              onClick={() => handleCopy(communication.alert_telugu, false)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              {copiedTelugu ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>కాపీ చేయబడింది!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Telugu Alert</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Public Safety Instructions & Authority Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Public Instructions */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <ListChecks className="w-5 h-5 text-emerald-400" />
            <span>Detailed Public Instructions</span>
          </div>

          <div className="space-y-2.5">
            {communication.public_instructions.map((inst, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-200 leading-snug"
              >
                <span className="font-mono font-bold text-emerald-400 shrink-0">
                  [{idx + 1}]
                </span>
                <span>{inst}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Authority Summary & Broadcast Channels */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <FileText className="w-5 h-5 text-rose-400" />
            <span>Emergency Authority Summary</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed font-mono">
            {communication.authority_summary}
          </div>

          {communication.broadcast_channels && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-slate-400 font-mono block">
                Dissemination Channels:
              </span>
              <div className="space-y-1.5">
                {communication.broadcast_channels.map((ch, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-xs text-slate-300 font-mono bg-slate-950/50 p-2 rounded-lg border border-slate-800/80"
                  >
                    <Radio className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">{ch}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
