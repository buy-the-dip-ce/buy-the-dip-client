const Link: React.FC<{ href: string }> = ({ href, children }) => {
  const onClick = (e) => {
    e.preventDefault();

    const locationChangeEvent = new CustomEvent("locationchange", {
      composed: true,
      detail: { href: href },
    });
    window.dispatchEvent(locationChangeEvent);
  };
  return (
    <a href={href} onClick={onClick}>
      {children}
    </a>
  );
};

export default Link;
