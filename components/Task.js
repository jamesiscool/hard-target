import React, {Component, PropTypes} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {response, finishRendering} from '../actions/actions'
import * as TaskTypes from '../constants/Task'
import d3 from 'd3'
var classNames = require('classnames');

class Task extends Component {
    constructor(props, context) {
        super(props, context)
    }

    handelOnKeyPress(e) {
        e.preventDefault();
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
        const svg = d3.select("svg")
        svg.selectAll("*").remove()
        const width = svg.style("width") !== "0px" ? parseInt(svg.style("width"), 10) : 1920; //svg.style("width") doesn't work with webpack dev server so use defaults
        const height = svg.style("height") !== "0px" ? parseInt(svg.style("height"), 10) : 1080; //svg.style("height") doesn't work with webpack dev server so use defaults
        const edgePadding = 50;
        if (this.props.taskType.title === "Spatial-configuration Search") {


            const numberPadding = 0;
            const numberOfItems = this.props.setSize;

            for (var i = 1; i <= numberOfItems; i++) {
                var allNodesBeforeNewNode = svg.selectAll("text");
                var newNode = svg.append("svg:text")
                    .attr("x", this.randomIntFromInterval(edgePadding, width - edgePadding)).attr("y", this.randomIntFromInterval(edgePadding, height - edgePadding))
                    .attr("fill", "white")
                    .style("font-size", this.props.taskType.elementHeight + "px")
                    .style("font-family", "Digital")
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
            const numberOfLines = this.props.setSize / 2;

            const redLine = this.props.targetPresent ? this.randomIntFromInterval(1, numberOfLines) : null
            for (var rowIndex = 1; rowIndex <= numberOfLines; rowIndex++) {
                var allNodesBeforeNewNode = svg.selectAll("rect");
                var newNode = svg.append("svg:rect")
                    .attr("x", this.randomIntFromInterval(edgePadding, width - (edgePadding + this.props.taskType.longLength))).attr("y", this.randomIntFromInterval(edgePadding, height - (edgePadding + this.props.taskType.shortLength)))
                    .attr("height", this.props.taskType.shortLength).attr("width", this.props.taskType.longLength)
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
                    newNode.remove()
                    rowIndex--
                }
            }
            for (var columnIndex = 1; columnIndex <= numberOfLines; columnIndex++) {
                var allNodesBeforeNewNode = svg.selectAll("rect");
                var newNode = svg.append("svg:rect")
                    .attr("x", this.randomIntFromInterval(edgePadding, width - (edgePadding + this.props.taskType.shortLength))).attr("y", this.randomIntFromInterval(edgePadding, height - (edgePadding + this.props.taskType.longLength)))
                    .attr("height", this.props.taskType.longLength).attr("width", this.props.taskType.shortLength)
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
    taskType: PropTypes.object.isRequired,
    startTime: PropTypes.number.isRequired,
    setSize: PropTypes.number.isRequired,
    response: PropTypes.func.isRequired,
    finishRendering: PropTypes.func.isRequired
}

function mapStateToProps(state) {
    return {
        targetPresent: state.currentTask.targetPresent,
        taskType: state.taskType,
        startTime: state.currentTask.startTime,
        setSize: state.currentTask.setSize
    }
}

export default connect(
    mapStateToProps,
    {response, finishRendering}
)(Task)
