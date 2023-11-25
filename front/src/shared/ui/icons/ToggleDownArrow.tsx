import React, { FC, memo, SVGProps } from "react"

type IProps = SVGProps<SVGSVGElement> & {
  svgColor?: string
}

export const ToggleDownArrow: FC<IProps> = memo(
  ({ svgColor = "currentColor" }) => {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 13L6 9.14754L7.19149 8L10 10.7049L12.8085 8L14 9.14754L10 13Z"
          fill={svgColor}
          fillOpacity="0.8"
        />
      </svg>
    )
  }
)
