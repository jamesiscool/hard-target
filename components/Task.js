import React, {Component, PropTypes} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {response} from '../actions/actions'
import * as TaskTypes from '../constants/TaskTypes'
import d3 from 'd3'
var classNames = require('classnames');

class Task extends Component {
    constructor(props, context) {
        super(props, context)
    }

    handelOnKeyPress(e) {
        if (e.keyCode == 47) {
            this.props.response(true);
        } else if (e.keyCode == 122) {
            this.props.response(false);
        }
    }

    componentDidMount() {
        document.body.style.backgroundColor = "black";
        document.onkeypress = this.handelOnKeyPress.bind(this)
        this.componentWillReceiveProps()
    }

    randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    componentWillReceiveProps() {
        const svg = d3.select("svg");
        const width = svg.style("width") !== "0px" ? parseInt(svg.style("width"), 10) : 2146; //svg.style("width") doesn't work with webpack dev server so use defaults
        const height = svg.style("height") !== "0px" ? parseInt(svg.style("height"), 10) : 1251; //svg.style("height") doesn't work with webpack dev server so use defaults
        const edgePadding = 50;
        if (this.props.taskType === TaskTypes.CONJUNCTION_SEARCH) {
            svg.selectAll("*").remove()

            const numberPadding = 0;
            const numberOfItems = 20;

            for (var i = 1; i <= numberOfItems; i++) {
                var allNodesBeforeNewNode = svg.selectAll("text");
                var newNode = svg.append("svg:text")
                    .attr("x", this.randomIntFromInterval(edgePadding, width - edgePadding)).attr("y", this.randomIntFromInterval(edgePadding, height - edgePadding))
                    .attr("fill", "white")
                    .style("font-size", "70px")
                    .style("font-family", "sans-serif")
                    .text(this.props.targetPresent && i == 1 ? "2" : "5");
                var overlaps = false;
                allNodesBeforeNewNode.each(function (d, i) {
                    var thisbb = this.getBoundingClientRect(),
                        newNodeBb = newNode[0][0].getBoundingClientRect();
                    if (!(thisbb.right < newNodeBb.left + numberPadding ||
                        thisbb.left > newNodeBb.right + numberPadding ||
                        thisbb.bottom < newNodeBb.top + numberPadding ||
                        thisbb.top > newNodeBb.bottom + numberPadding)) {
                        overlaps = true;
                    }
                })
                if (overlaps) {
                    console.log("they overlap")
                    newNode.remove()
                    i--
                }
            }

        } else {
            const linePadding = 20;
            const numberOfLines = 20;

            const redLine = this.props.targetPresent ? this.randomIntFromInterval(1, numberOfLines) : null
            for (var rowIndex = 1; rowIndex <= numberOfLines; rowIndex++) {
                var allNodesBeforeNewNode = svg.selectAll("rect");
                var newNode = svg.append("svg:rect")
                    .attr("x", this.randomIntFromInterval(edgePadding, width - (edgePadding + 100))).attr("y", this.randomIntFromInterval(edgePadding, height - (edgePadding + 20)))
                    .attr("height", 20).attr("width", 100)
                    .attr("fill", rowIndex !== redLine ? "green" : "red");
                var overlaps = false;
                allNodesBeforeNewNode.each(function (d, i) {
                    var thisbb = this.getBoundingClientRect(),
                        newNodeBb = newNode[0][0].getBoundingClientRect();
                    if (!(thisbb.right < newNodeBb.left - linePadding ||
                        thisbb.left > newNodeBb.right + linePadding ||
                        thisbb.bottom < newNodeBb.top - linePadding ||
                        thisbb.top > newNodeBb.bottom + linePadding)) {
                        overlaps = true;
                    }
                })
                if (overlaps) {
                    console.log("they overlap")
                    newNode.remove()
                    rowIndex--
                }
            }
            for (var columnIndex = 1; columnIndex <= numberOfLines; columnIndex++) {
                var allNodesBeforeNewNode = svg.selectAll("rect");
                var newNode = svg.append("svg:rect")
                    .attr("x", this.randomIntFromInterval(edgePadding, width - (edgePadding + 20))).attr("y", this.randomIntFromInterval(edgePadding, height - (edgePadding + 100)))
                    .attr("height", 100).attr("width", 20)
                    .attr("fill", "red");
                var overlaps = false;
                allNodesBeforeNewNode.each(function (d, i) {
                    var thisbb = this.getBoundingClientRect(),
                        newNodeBb = newNode[0][0].getBoundingClientRect();
                    if (!(thisbb.right < newNodeBb.left - linePadding ||
                        thisbb.left > newNodeBb.right + linePadding ||
                        thisbb.bottom < newNodeBb.top - linePadding ||
                        thisbb.top > newNodeBb.bottom + linePadding)) {
                        overlaps = true;
                    }
                })
                if (overlaps) {
                    console.log("they overlap")
                    newNode.remove()
                    columnIndex--
                }
            }
        }
    }

    componentWillUnmount() {
        document.body.style.backgroundColor = "white";
        document.onkeypress = null;
    }

    render() {
        return (
            <svg height="100%" width="100%"></svg>
        )
    }
}

Task.propTypes = {
    targetPresent: PropTypes.bool.isRequired,
    taskType: PropTypes.string.isRequired,
    response: PropTypes.func.isRequired,
    startTime: PropTypes.number.isRequired
}

function mapStateToProps(state) {
    console.log(state)
    return {
        targetPresent: state.currentTask.targetPresent,
        taskType: state.taskType,
        startTime: state.currentTask.startTime
    }
}

export default connect(
    mapStateToProps,
    {response}
)(Task)
