import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api';

const TranslatedText = ({ text, type = 'title', className = '' }) => {
  const { i18n } = useTranslation();
  const [displayText, setDisplayText] = useState(text);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isHindi = i18n.language && i18n.language.startsWith('hi');
    
    if (!isHindi) {
      setDisplayText(text);
      return;
    }

    const translate = async () => {
      setLoading(true);
      try {
        const res = await api.post('/news/translate-card', {
          title: type === 'title' ? text : '',
          description: type === 'description' ? text : '',
          language: 'hi'
        });
        if (res.data.success) {
          setDisplayText(type === 'title' ? res.data.title : res.data.description);
        }
      } catch (err) {
        console.error('Text translation failed:', err);
      } finally {
        setLoading(false);
      }
    };

    translate();
  }, [i18n.language, text, type]);

  if (loading) return <span className="animate-pulse opacity-50 italic">Translating...</span>;
  return <span className={className}>{displayText}</span>;
};

export default TranslatedText;
