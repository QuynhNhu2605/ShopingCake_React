import React from "react";
import { Navbar, Nav } from "react-bootstrap";

const NavigationBar = ({ menus, userId }) => {
  return (
    <Navbar>
      <Nav >
        {menus.map((menu, index) => (
          (menu === "Products") ? (<Nav.Link key={index} href={`/home/${userId}`}>
            {menu}
          </Nav.Link>) : (<Nav.Link key={index} href={`/${menu}/${userId}`}>
            {menu}
          </Nav.Link>)

        ))}
      </Nav>
    </Navbar>
  );
};

export default NavigationBar;
