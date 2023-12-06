import now from 'get-date-time-now';
import { Link } from 'react-router-dom';

const date = now();

const Public = () => {
  const content = (
    <section className="public">
      <header>
        <h1>
          Welcome to <span className="nowrap">Dnyandeo Repairs!</span>
        </h1>
      </header>
      <main className="public__main">
        <p>
          Located in Beautiful Downtown Brussels City, Dnyandeo Repairs provides
          a trained staff ready to meet your tech repair needs.
        </p>
        <address className="public__addr">
          Dnyandeo Repairs
          <br />
          Brussels City
          <br />
          <a href="tel:+15555555555">(555) 555-5555</a>
        </address>
        <br />
        <p>Owner: Dnyandeo</p>
      </main>
      <footer>
        <Link to="/login">Employee Login</Link>
        <div>
          <p>{date}</p>
        </div>
      </footer>
    </section>
  );
  return content;
};
export default Public;
