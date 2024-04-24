import React from "react";
import { Navbar, Nav } from "react-bootstrap";

const NavigationBar = ({ menus }) => {

  return (
    <Navbar>
      <Nav >
        {menus.map((menu, index) => (
          (menu === "Products") ? (<Nav.Link key={index} href={`/home`}>
            {menu}
          </Nav.Link>) : (<Nav.Link key={index} href={`/${menu}`}>
            {menu}
          </Nav.Link>)

        ))}
      </Nav>
    </Navbar>
  );
};

export default NavigationBar;
