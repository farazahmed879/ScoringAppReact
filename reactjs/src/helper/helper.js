export const truncateText = (data, limit) => {
    let text = data;
    if (text) {
      text = text.toString();
      text = text.trim();
      if (text.length > limit) text = text.substring(0, limit) + '...';
    }
    return text;
  };
  