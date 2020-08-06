/** @jsx jsx */

import React from 'react';
import {motion} from 'framer-motion';
import {ThemeProvider, jsx} from 'theme-ui';
import WidgetToggle from './Toggle';
import {CustomerMetadata} from './api';
import getThemeConfig from './theme';

type Props = {
  title?: string;
  subtitle?: string;
  primaryColor?: string;
  accountId: string;
  baseUrl?: string;
  greeting?: string;
  customer?: CustomerMetadata;
  defaultIsOpen?: boolean;
};

const EmbeddableWidget = ({
  accountId,
  title,
  subtitle,
  primaryColor,
  baseUrl,
  greeting,
  customer,
  defaultIsOpen = false,
}: Props) => {
  const [isOpen, setIsOpen] = React.useState(defaultIsOpen);
  const theme = getThemeConfig({primary: primaryColor});

  const handleToggleOpen = () => setIsOpen(!isOpen);

  console.log({isOpen});

  return (
    <ThemeProvider theme={theme}>
      {/* {isOpen && ( */}
      <motion.iframe
        className="Papercups-chatWindowContainer"
        // initial={{opacity: 0, y: 4}}
        // animate={{opacity: 1, y: 0}}
        animate={isOpen ? 'open' : 'closed'}
        variants={{
          closed: {opacity: 0, y: 4},
          open: {opacity: 1, y: 0},
        }}
        transition={{duration: 0.2, ease: 'easeIn'}}
        src="http://localhost:3000/widget"
        style={isOpen ? {} : {bottom: -9999}}
        sx={{
          border: 'none',
          variant: 'styles.WidgetContainer',
        }}
      ></motion.iframe>
      {/* )} */}
      <motion.div
        className="Papercups-toggleButtonContainer"
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        sx={{
          variant: 'styles.WidgetToggleContainer',
        }}
      >
        <WidgetToggle toggle={handleToggleOpen} />
      </motion.div>
    </ThemeProvider>
  );
};

export default EmbeddableWidget;
