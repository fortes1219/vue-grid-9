const formatCurrency = {
  // 生命週期hooks(el, binding)
  mounted(el, binding) {
    let config = binding.value || { locale: 'en-US', currency: 'USD', minimumFractionDigits: 2 };
    let formatter = new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.currency,
      minimumFractionDigits: config.minimumFractionDigits
    });

    const formatCurrency = (value) => {
      const number = parseFloat(value.replace(/[^\d.-]/g, ''));
      return formatter.format(isNaN(number) ? 0 : number);
    };

    const onInput = (e) => {
      let cursorPosition = e.target.selectionStart - (e.target.value.match(/[^0-9.-]/g) || []).length;
      e.target.value = formatCurrency(e.target.value);
      cursorPosition += (e.target.value.match(/[^0-9.-]/g) || []).length;
      e.target.setSelectionRange(cursorPosition, cursorPosition);
    };

    el.addEventListener('blur', onInput);
  },
  beforeUnmount(el) {
    el.removeEventListener('blur', onInput);
  }
};

export default formatCurrency;
