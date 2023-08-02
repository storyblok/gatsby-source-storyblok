/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */
"use client";
import React from "react"
import PropTypes from "prop-types"
import { storyblokInit, apiPlugin } from "gatsby-source-storyblok"
import Teaser from './Teaser'
import Grid from './Grid'
import Page from './Page'
import Feature from './Feature'
import configuration from '../../gatsby-config'

const sbConfig = configuration.plugins.find((item) => item.resolve === 'gatsby-source-storyblok')

storyblokInit({
  accessToken: sbConfig.options.accessToken,
  use: [apiPlugin],
  components: {
    teaser: Teaser,
    grid: Grid,
    feature: Feature,
    page: Page
  }
});

const Layout = ({ children }) => {
  return (
    <div>
      <main>{children}</main>
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout