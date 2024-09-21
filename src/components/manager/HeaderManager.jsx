import React, { useState } from "react";
import {
  Navbar,
  Typography,
  IconButton,
  Avatar,
  Badge,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import {
  BellIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import { FaBars, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { close, open } from "../../redux/features/sidebarSlice";

const HeaderManager = ({ userName = "Admin" }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);
  const dispatch = useDispatch();
  const siderbar = useSelector((state) => state.sidebar);
  return (
    <Navbar className="mx-auto max-w-full px-4 py-6">
      <div className="flex items-center justify-between text-blue-gray-900">
        <button
          onClick={() => {
            if (siderbar.isOpen) {
              dispatch(close());
            } else {
              dispatch(open());
            }
          }}
          className="md:hidden focus:outline-none"
        >
          {siderbar?.isOpen ? (
            <>
              <FaTimes className="h-6 w-6 text" />
            </>
          ) : (
            <>
              <FaBars className="h-6 w-6 text" />
            </>
          )}
        </button>
        <Typography
          as="a"
          href="#"
          variant="h4"
          className="flex justify-center items-center mr-4 cursor-pointer py-1.5 lg:ml-2"
        >
          Welcome, {userName}
        </Typography>

        <div className="flex items-center gap-4">
          <Badge content="4" color="red">
            <IconButton variant="text" color="blue-gray">
              <BellIcon className="h-5 w-5" />
            </IconButton>
          </Badge>

          <Menu
            open={isMenuOpen}
            handler={setIsMenuOpen}
            placement="bottom-end"
          >
            <MenuHandler>
              <IconButton variant="text" color="blue-gray">
                <Avatar
                  size="sm"
                  alt={userName}
                  src="/path-to-avatar-image.jpg"
                  className="border border-blue-500 p-0.5"
                />
              </IconButton>
            </MenuHandler>
            <MenuList className="p-1">
              <MenuItem onClick={closeMenu} className="flex items-center gap-2">
                <UserCircleIcon className="h-4 w-4" />
                <Typography variant="small" className="font-normal">
                  Profile
                </Typography>
              </MenuItem>
              <MenuItem onClick={closeMenu} className="flex items-center gap-2">
                <Cog6ToothIcon className="h-4 w-4" />
                <Typography variant="small" className="font-normal">
                  Settings
                </Typography>
              </MenuItem>
              <MenuItem onClick={closeMenu} className="flex items-center gap-2">
                <PowerIcon className="h-4 w-4" />
                <Typography variant="small" className="font-normal">
                  Logout
                </Typography>
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>
    </Navbar>
  );
};

export default HeaderManager;
