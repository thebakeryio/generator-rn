/*
 *
 * <%= helpers.properCase(componentName) %>
 *
 */

import React, { Component, View, Text } from 'react-native';
<% if (isContainer) { %>
import { connect } from 'react-redux';
  <% if (selectorName) { %>
import { createSelector } from 'reselect';
import { <%= selectorName %>Selector } from '../selectors/<%= selectorName %>';
  <% } %>
<% } %>

class <%= componentName %> extends Component {
  render() {
    return (
      <View>
        <Text><%= helpers.properCase(componentName) %></Text>
      </View>
    );
  }
}

<% if (isContainer) { %>
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}
<% } %>

<% if (selectorName) { %>
export default connect(createSelector(
  <%= selectorName %>Selector(),
  (<%= selectorName %>) => ({ <%= selectorName %> })
), mapDispatchToProps)(<%= componentName %>);
<% } else { %>
  <% if (isContainer) { %>
function mapStateToProps(state) {
  return {}; 
}
export default connect(mapStateToProps, mapDispatchToProps)(<%= componentName %>);
  <% } else { %>
export default <%= componentName %>;
  <% } %>
<% } %>