import React, { Component } from "react";
import { Slider, Rail, Handles, Tracks, Ticks } from "react-compound-slider";
import { SliderRail, Handle, Track, Tick } from "./components"; // example render components - source below
import { subDays, startOfToday, format } from "date-fns";
import { scaleTime } from "d3-scale";

const sliderStyle = {
  position: "relative",
  top: '-50px',
  width: "60%"
};

function formatTick(ms) {
  return format(new Date(ms), "MMM dd");
}

const halfHour = 1000 * 60 * 30;

class SliderContainer extends Component {
  constructor() {
    super();

    const today = startOfToday();
    const oneWeekAgo = subDays(today, 7);

    this.state = {
      selected: today,
      updated: today,
      min: oneWeekAgo,
      max: today
    };
  }

  onChange = ([ms]) => {
    this.setState({
      selected: new Date(ms)
    });
  };

  onUpdate = ([ms]) => {
    this.setState({
      updated: new Date(ms)
    });
  };

  renderDateTime(date, header) {
    return (
      <div
        style={{
          width: "100%",
          textAlign: "center",
          fontFamily: "Arial",
          margin: 5,
        }}
      >
        <b>{header}:</b>
        <div style={{ fontSize: 12 }}>{format(date, "MMM dd h:mm a")}</div>
      </div>
    );
  }

  render() {
    const { min, max, selected, updated } = this.state;

    const dateTicks = scaleTime()
      .domain([min, max])
      .ticks(8)
      .map(d => +d);

    return (
      <div style={{
        position: "relative",
        top: "560px"
      }}>
        {this.renderDateTime(selected, "Selected")}
        {this.renderDateTime(updated, "Updated")}
        <div style={{ margin: "5%", height: 120, width: "90%" }}>
          <Slider
            mode={1}
            step={halfHour}
            domain={[+min, +max]}
            rootStyle={sliderStyle}
            onUpdate={this.onUpdate}
            onChange={this.onChange}
            values={[+selected]}
          >
            <Rail>
              {({ getRailProps }) => <SliderRail getRailProps={getRailProps} />}
            </Rail>
            <Handles>
              {({ handles, getHandleProps }) => (
                <div>
                  {handles.map(handle => (
                    <Handle
                      key={handle.id}
                      handle={handle}
                      domain={[+min, +max]}
                      getHandleProps={getHandleProps}
                    />
                  ))}
                </div>
              )}
            </Handles>
            <Tracks right={false}>
              {({ tracks, getTrackProps }) => (
                <div>
                  {tracks.map(({ id, source, target }) => (
                    <Track
                      key={id}
                      source={source}
                      target={target}
                      getTrackProps={getTrackProps}
                    />
                  ))}
                </div>
              )}
            </Tracks>
            <Ticks values={dateTicks}>
              {({ ticks }) => (
                <div>
                  {ticks.map(tick => (
                    <Tick
                      key={tick.id}
                      tick={tick}
                      count={ticks.length}
                      format={formatTick}
                    />
                  ))}
                </div>
              )}
            </Ticks>
          </Slider>
        </div>
      </div>
    );
  }
}

export default SliderContainer;