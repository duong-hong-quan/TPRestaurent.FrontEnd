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

const HeaderManager = ({ userName = "Admin" }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <Navbar className="mx-auto max-w-full px-4 py-6">
      <div className="flex items-center justify-between text-blue-gray-900">
        <Typography
          as="a"
          href="#"
          variant="h4"
          className="flex justify-center items-center mr-4 cursor-pointer py-1.5 lg:ml-2"
        >
          Welcome, {userName}
          <img
            src="https://s3-alpha-sig.figma.com/img/bbcf/8c57/d87742f97f75030cb94ee88ccf5f5df3?Expires=1724025600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=qFyMLVesiw9spwlTwLd-ojuipai4dz~MPuN~qJ7pqeq-DgfTUs2f7B1Kx8oNNp15KtcGtVy~XuHz~1B8bLRanP3pm0w8iP5LoiwzYBAi6SKviQXK2x~DqsywXPkSXB-YbKF4TcHK63CPVuSKy~Npr2ZQeg82kto~4y8FgeVJyV8hpvcfa5G6XGBAYwBYGZzlVGM26YqQaBjupx9MO-RcAE~2QTymcNVGazu298UsZHRzdoeJ5TBR~Ej2aILcdke6ShKgVcMoXoEFP1YUr9p00teOceSB6v1RclJ5QS9rDIqvwzTwnYnY8HB4NsV749l6qfqIHN7YCyT9JiVTTOvTWQ__"
            alt=""
            className="w-10 h-10 mx-4"
          />
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
