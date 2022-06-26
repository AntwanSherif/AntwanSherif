/** @jsx jsx */
import { Footer as ThemeFooter, Styled, Flex, jsx } from "theme-ui"

const Footer = () => {
  return (
    <>
    <ThemeFooter>
      Copyright &copy; {new Date().getFullYear()}. All rights reserved.
      {/* <br />
      <Flex
        sx={{
          justifyContent: `center`,
          alignItems: `center`,
          mt: 3,
          color: `text`,
          fontWeight: `semibold`,
          a: { color: `text` },
        }}
      >
        <img width="30" height="30" src="https://img.lekoarts.de/gatsby/logo_w30.png" alt="LekoArts Logo" />
        {` `}
    <script src="https://connect.shore.com/widget/loading.js"></script><a class="termine24-widget termine24-widget-custom" style="background-color: #1162e5; color: #ffffff;" target="_blank" href="https://connect.shore.com/widget/instagram-test?locale=en-US">Book Now</a>
        
        <Styled.a
          aria-label="Link to the theme's GitHub repository"
          sx={{ ml: 2 }}
          href="https://github.com/LekoArts/gatsby-themes/tree/master/themes/gatsby-theme-cara"
        >
          Theme
        </Styled.a>
        <div sx={{ mx: 1 }}>by</div>
        {` `}
        <Styled.a aria-label="Link to the theme author's website" href="https://www.lekoarts.de/en">
          LekoArts
        </Styled.a>
      </Flex> */}      
    </ThemeFooter>
    </>
  )
}

export default Footer
