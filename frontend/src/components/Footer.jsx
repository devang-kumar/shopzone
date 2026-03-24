import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top container">
        <div>
          <h4>Get to Know Us</h4>
          <a href="#">About ShopZone</a>
          <a href="#">Careers</a>
          <a href="#">Press Releases</a>
        </div>
        <div>
          <h4>Make Money with Us</h4>
          <a href="#">Sell on ShopZone</a>
          <a href="#">Become an Affiliate</a>
        </div>
        <div>
          <h4>Let Us Help You</h4>
          <a href="#">Your Account</a>
          <a href="#">Returns & Replacements</a>
          <a href="#">Help</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 ShopZone. All rights reserved.</p>
      </div>
    </footer>
  );
}
