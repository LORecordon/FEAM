import React, { Component } from "react";
import './TopNav.css';
import { Avatar, Box, Button, Container, Menu, MenuItem } from "@mui/material";
import { Rectangle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";


function checkLclStrg(){
  try{
    if (localStorage.getItem("token").length !== 0){
      return true;
    }
  } catch {
    localStorage.setItem("token", "")
    return false;
  }
}

function TopNav(props) {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMenuClick = (event) => {
    if (event.currentTarget.id === "logout"){
      localStorage.setItem("token", "")
      localStorage.setItem("email", "")
      setAnchorEl(null)
      navigate("/login")
    } else {
      console.log("Navigating to " + event.currentTarget.id)
      setAnchorEl(null)
      navigate("/" + event.currentTarget.id)
    }
  }

  if (checkLclStrg()){
    return (
      <Box className={"BoxNav"}>
        <Container sx={{ width: '100%', height: '85px', position: 'fixed', top: 0, left: 0 }}>
          <p className={"AppName"}>Travel Log</p>
          <Button
            id="profile-button"
            aria-controls={open ? 'profile-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            sx={{ position: 'absolute', top: '16px', left: '16px' }}
          >
          <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" left={0} position={"absolute"} />

          </Button>

          <Menu
            id="profile-menu"
            spacing={2}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'profile-button',
            }}

          >
            <MenuItem id="profile" onClick={handleMenuClick}>Profile</MenuItem>
            <MenuItem id="settings" onClick={handleMenuClick}>Settings</MenuItem>
            <MenuItem id="logout" onClick={handleMenuClick}>Logout</MenuItem>
          </Menu>

        </Container>
      </Box>
    );
  } else {
    return (
      <Box className={"BoxNav"}>
      <Container sx={{ width: '100%', height: '85px', position: 'fixed', top: 0, left: 0 }}>
        <p className={"AppName"}>Travel Log</p>
        <Button
          id="profile-button"
          aria-controls={open ? 'profile-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          sx={{ position: 'absolute', top: '16px', left: '16px' }}
        >
          <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" left={0} position={"absolute"} />

        </Button>

        <Menu
          id="profile-menu"
          spacing={2}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'profile-button',
          }}

        >
          <MenuItem id="login" onClick={handleMenuClick}>LogIn</MenuItem>
        </Menu>

      </Container>
    </Box>
    )
  }
}

export default TopNav;
