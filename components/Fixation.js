import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { response } from '../actions/actions'
import * as TaskTypes from '../constants/Task'
import d3 from 'd3'


class Fixation extends Component {
    constructor(props, context) {
        super(props, context)
    }

    componentDidMount() {
        document.body.style.backgroundColor = "black";
        const svg = d3.select("svg");
        const width = svg.style("width") !== "0px" ? parseInt(svg.style("width"), 10) : 2146; //svg.style("width") doesn't work with webpack dev server so use defaults
        const height = svg.style("height") !== "0px" ? parseInt(svg.style("height"), 10) : 1251; //svg.style("height") doesn't work with webpack dev server so use defaults

        const crossLength = 150
        const crossStroke = 10


        svg.append("svg:line")
            .attr("x1", (width / 2) - (crossLength / 2)).attr("x2", (width / 2) + (crossLength / 2))
            .attr("y1", height / 2).attr("y2", height / 2)
            .attr("stroke-width", crossStroke)
            .attr("stroke", "white");

        svg.append("svg:line")
            .attr("x1", width / 2).attr("x2", width / 2)
            .attr("y1", (height / 2) - (crossLength / 2)).attr("y2", (height / 2) + (crossLength / 2))
            .attr("stroke-width", crossStroke)
            .attr("stroke", "white");
    }

    componentWillUnmount() {
        document.body.style.backgroundColor = "white";
    }

    render() {
        return (
            <svg height="100%" width="100%"></svg>
        )
    }
}

export default connect()(Fixation)
