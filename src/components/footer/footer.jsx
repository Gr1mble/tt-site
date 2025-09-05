import "./footer.css";

export const Footer = () => {
  return (
    <div className="footer">
      <h1 className="footerHeader">Terrific Ten</h1>
      <a
        className="aFooter"
        href="https://www.facebook.com/Camp-Kirkwood-184907419322"
        target="_blank"
        rel="noopener noreferrer"
      >
        <i className="bi bi-facebook"></i>
      </a>
      <a className="aFooter" rel="noopener noreferrer" href="/">
        <i className="bi bi-paypal"></i>
      </a>
    </div>
  );
};
