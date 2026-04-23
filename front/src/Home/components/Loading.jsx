import React from "react";
import "../style/import.css";

export default function Loading() {
    return (
        /*<div className={"padre"}>*/
        <div id="NoMoreLoader">
            <div className={"loader-stage paper"}>
                <div className={"pixar-container"} role="status" aria-label="Loading animation">
                    <div class="laughing-group">
                    <span class="toy-letter">C</span>
                    <span class="toy-letter">a</span>
                    <span class="toy-letter">r</span>
                    <span class="toy-letter">g</span>
                    <span class="toy-letter">a</span>
                    <span class="toy-letter">n</span>
                    <span class="toy-letter">d</span>
                    <span class="toy-letter">o</span>
                    <span class="toy-letter">.</span>
                    <span class="toy-letter">.</span>
                    <span class="toy-letter">.</span>
                    </div>
                </div>
            </div>
        </div>
        /*</div>*/
    )
}