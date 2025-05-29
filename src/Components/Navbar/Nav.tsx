
const Navbar = () => {
  return (
    <div>
      <nav className="bg-gray-50 ">
        <ul className="siteWidth">
            <li>
                <a href={'/home'}>
                <img src="/logoBlack.png" className="object-content-fit mix-blend-multiply w-32 mx-15 py-2 "  alt="black" />
                </a>
            </li>
        </ul>
      </nav>
    </div>
  )
}

export default Navbar
