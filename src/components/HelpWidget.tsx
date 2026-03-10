import { useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface HelpWidgetProps {
  userId: string;
}

export default function HelpWidget({ userId }: HelpWidgetProps) {
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const sendPing = async () => {
    if (sending) return;

    setSending(true);
    setSuccess(false);

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('law_firm_id')
        .eq('id', userId)
        .maybeSingle();

      if (!profile?.law_firm_id) {
        alert('No law firm associated with your account');
        return;
      }

      const { data: lawFirmAdmin } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('law_firm_id', profile.law_firm_id)
        .eq('user_type', 'admin')
        .maybeSingle();

      if (!lawFirmAdmin) {
        alert('Could not find your law firm administrator');
        return;
      }

      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: lawFirmAdmin.id,
          type: 'help_request',
          title: 'Client Needs Help',
          message: 'A client has requested assistance with their court preparation',
          action_url: '/clients',
          priority: 'high'
        });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error sending ping:', error);
      alert('Failed to send message to your lawyer');
    } finally {
      setSending(false);
    }
  };

  if (!isExpanded) {
    return (
      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={() => setIsExpanded(true)}
          className="w-14 h-14 bg-gradient-to-r from-gray-900 to-gray-800 hover:shadow-xl rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          aria-label="Need help?"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <div className="w-80 bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
        <div className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-gray-900 to-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-1">Need help?</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Get expert support for your court preparation from your lawyer, with one click
              </p>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <button
            onClick={sendPing}
            disabled={sending || success}
            className={`w-full py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
              success
                ? 'bg-green-600 text-white'
                : 'bg-white text-slate-900 hover:bg-slate-100 active:scale-95'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {success ? (
              <>
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                Message sent!
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                {sending ? 'Sending...' : 'Send my lawyer a ping'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
