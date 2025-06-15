export default function Navbar() {
  return (
    <header>
      <div className="container">
        <h1>Automated Bus Scheduler</h1>
        <nav>
          <ul>
            <li><a href="/home">Home</a></li>
            <li><a href="/login">Login</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
             <li><a href="/profile">Profile</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );  
}