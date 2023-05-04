import { Link } from "react-router-dom";

function Footer() {
  const link = "https://www.github.com/itznishant";

  return (
      <div className="footer">
          <footer>
          <Link className="links" to={link}>{link}</Link>
          </footer>
      </div>
  )
}

export default Footer;