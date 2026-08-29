const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'] as const;

export const useLocaleDigits = () => {
  const { locale } = useI18n();

  const formatDigits = (value: string | number) => {
    const normalizedValue = String(value);

    if (locale.value !== 'fa') {
      return normalizedValue;
    }

    return normalizedValue.replace(/\d/g, (digit) => persianDigits[Number(digit)] || digit);
  };

  return {
    formatDigits
  };
};
