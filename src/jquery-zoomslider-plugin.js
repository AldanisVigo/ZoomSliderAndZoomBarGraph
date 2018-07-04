/*
	Author: Aldanis Vigo
	Description: Customizable Zoom Slider jQuery plugin
	Datetime: July 3rd 2018
*/
$(document).ready(()=>{
	$.fn.ZoomSlider = function(options){
		//Retrieve user options
		options = $.extend({}, $.fn.ZoomSlider.options, options)
		
		//Set option defaults if user options were not provided
		if(options.width == null || options.width == undefined){
			options.width = '100%' //Default width
		}
		if(options.height == null || options.height == undefined){
			options.height = '20px' //Default height
		}

		if(options.slidersColor == null || options.slidersColor == undefined){
			options.slidersColor = '#d9584f' //Default slider color
		}

		if(options.handleColor == null || options.handleColor == undefined){
			options.handleColor = '#34333e' //Default handle color
		}

		if(options.backgroundColor == null || options.backgroundColor == undefined){
			options.backgroundColor = 'linear-gradient(to bottom,#989a98,#fff,#989a98)' //Default background color
		}

		if(options.leftPercent == null || options.leftPercent == undefined){
			options.leftPercent = 45 //Default left slider percent position
		}

		if(options.rightPercent == null || options.rightPercent == undefined){
			options.rightPercent = 55 //Default right slider percent position
		}

		//This is the user defined container
		const container = $(this)

		//This is te main slide container
		const slide_container = $(document.createElement('div')).css({
			'width' : options.width,
			'height' : options.height,
			'background' : options.backgroundColor,
			'border' : '2px groove black',
			'border-radius' : '5px',
			'position' : 'relative',
			'box-shadow' : '0 0 8px #000'
		})

		//Create the left slider
		let left_dragger = $(document.createElement('div')).css({
			'width' : '1px',
			'height' : '100%',
			'background' : options.slidersColor,
			'display' : 'inline-block',
			'z-index' : '1',
			'position' : 'relative',
			'opacity' : '0.1',
			'float' : 'left',
			//'box-shadow' : 'inset 0 0 10px #000'
		}).hover(e=>{
			$(left_dragger).css({
				'cursor' : 'ew-resize'
			})
		})

		//Create the right slider
		let right_dragger = $(document.createElement('div')).css({
			'width' : '1px',
			'height' : '100%',
			'background' : options.slidersColor,
			'display' : 'inline-block',
			'z-index' : 1,
			'position' : 'relative',
			'opacity' : '0.1',
			'float' : 'left',
			//'box-shadow' : 'inset 0 0 10px #000'
		}).hover(e=>{
			$(right_dragger).css({
				'cursor' : 'ew-resize'
			})
		})

		//Add the left and right sliders to the slide container
		$(slide_container).append(left_dragger)
		$(slide_container).append(right_dragger)
		$(container).append(slide_container)

		//Filler div to fill space between sliders 
		let filler = $(document.createElement('div')).css({
			'width' : '100px',
			'background' : 'linear-gradient(to bottom,' + options.handleColor + ',#fff,' + options.handleColor + ')',
			'box-shadow' : 'inset 0 0 10px #000',
			'overflow-y' : 'hidden'
		})

		//left and right handles
		let left_handle = $(document.createElement('div')).css({
			'width' : '2px',
			'background' : options.slidersColor,
			'float' : 'left',
			'height' : '100%'
		})

		let right_handle = $(document.createElement('div')).css({
			'width' : '2px',
			'background' : options.slidersColor,
			'float' : 'right',
			'height' : '100%'
		})

		//Applend the left and right handles to the filler handle
		$(filler).append(left_handle)
		$(filler).append(right_handle)
	
		//Create the left and right obstacle divs
		let right_obstacle = $(document.createElement('div'))
		let left_obstacle = $(document.createElement('div'))
		
		//Fills the right obstacle div between the left side of the right slider and the right side of the slide container
		const fill_right_obstacle = ()=>{
			$(right_obstacle).css({
				'position' : 'absolute',
				'width' : $(slide_container).width() - $(right_dragger).position().left - $(right_dragger).width(),
				'left' : $(right_dragger).position().left + $(right_dragger).width(),
				'background' : 'orange',
				'height' : $(slide_container).height(),
				'z-index' : 1,
				'opacity' : 0.0,
				'float' : 'right'
			})
		}

		//Fills the left obstacle div between the left side of the slide container and the right side of the left slider
		const fill_left_obstacle = ()=>{
			$(left_obstacle).css({
				'position' : 'absolute',
				'width' : $(left_dragger).position().left + $(left_dragger).width(),
				'left' : 0,
				'background' : 'green',
				'opacity' : 0.0,
				'height' : $(slide_container).height(),
				'z-index' : 0
			})
		}

		//Fills the gap between the sliders with the filler handle
		const fill_gap = ()=>{
			$(filler).css({
				'width' : $(right_dragger).position().left - $(left_dragger).position().left - $(right_dragger).width(),
				'position' : 'absolute',
				'left' : $(left_dragger).position().left + $(left_dragger).width(),
				'height' : $(slide_container).height()
			}).mouseover(e=>{
				$(filler).css({
					'cursor' : 'pointer'
				})
			})
		}

		//Adjusts the position of the left dragger during filler handle drag
		const adjust_left_dragger = ()=>{
			$(left_dragger).css({
				'position' : 'absolute',
				'left' : $(filler).position().left - ($(left_dragger).width())
			})
		}

		//Adjusts the position of the right dragger during filler handle drag
		const adjust_right_dragger = ()=>{
			$(right_dragger).css({
				'position' : 'absolute',
				'left' : $(filler).position().left + $(filler).width()
			})
		}

		//Fills the gap with the filler, fills the right and left obstacle divs
		const slider_action = ()=>{
			fill_gap()
			fill_right_obstacle()
			fill_left_obstacle()
			//adjust_left_dragger()
			//adjust_right_dragger()
		}
		
		//Append the filler, left and right obstacle divs to the slide container
		$(slide_container).append(filler)
		$(slide_container).append(left_obstacle)
		$(slide_container).append(right_obstacle)

		//Calculates the distance percentage for the left and right sliders as well as the percent selected by the filler handle
		const calculatePercentages = ()=>{
			let left_percent = parseInt((100 * $(filler).position().left - 1) / $(slide_container).width()) 
			// let right_percent = parseInt((100 * ($(filler).position().left + $(filler).width()) / ($(slide_container).width() - $(left_dragger).width() - $(right_dragger).width()) - 5)) 

			let percent_selected_first = 100 * ($(filler).width() + (2 * $(left_dragger).width()))
			let percent_selected = parseInt(percent_selected_first / ($(slide_container).width() - (2 * $(left_dragger).width() - 1)))
			//percent_selected = parseInt(percent_selected - 11)
			let right_percent = parseInt(left_percent + percent_selected)

			options.leftPercent = left_percent
			options.rightPercent = right_percent

			if(left_percent == undefined){
				left_percent = 0
			}
			if(right_percent == undefined){
				right_percent = 0
			}
			if(percent_selected == undefined){
				percent_selected = 0
			}


			options.slidersMoved(left_percent,right_percent,percent_selected)
		}

		//Make the left slider draggable
		$(left_dragger).draggable({
			axis : 'x',
			containment: 'parent',
			drag: ()=>{
				slider_action()
				calculatePercentages()
			},
			stop: ()=>{
				calculatePercentages()
			},
			refreshPositions: true,
            obstacle: [$(right_obstacle),$(right_dragger)],
            preventCollision: true,
		})

		//Make the right slider draggable
		$(right_dragger).draggable({
			axis : 'x',
			containment: 'parent',
			drag: ()=>{
				slider_action()
				calculatePercentages()
			},
			stop: ()=>{
				calculatePercentages()
			},
			refreshPositions: true,
            obstacle: $(left_obstacle),
            restraint: $(left_dragger),
            preventCollision: true,
		})

		/* Returns a div for use as the containment element of the handle */
		const filler_containment = ()=>{
			let containment = $(document.createElement('div'))
			$(containment).css({
				'position' : 'absolute',
				'left' : $(left_dragger).width(),
				'width' : $(slide_container).width() - $(left_dragger).width() - $(right_dragger).width(),
				'background-color' : 'green',
				'opacity' : '0.0',
				'height' : $(slide_container).height(),
				'z-index' : -1
			})
			return containment
		}

		let filler_containment_element = filler_containment()

		//Attach the filler containement element to the slide container
		$(slide_container).append(filler_containment_element)

		//Make the filler draggable
		$(filler).draggable({
			axis : 'x',
			containment: filler_containment_element,
			drag: ()=>{
				adjust_left_dragger()
				adjust_right_dragger()
				fill_right_obstacle()
				fill_left_obstacle()
				calculatePercentages()
			},
			stop: ()=>{
				calculatePercentages()
			}
		})

		/* Initialize slider positions based on the options provided */
		const initialize_slider_positions = ()=>{
			//Adjust the sliders based on the options
			$(left_dragger).css({
				'left' : (options.leftPercent * $(slide_container).width() - 2) / 100
			})	

			$(right_dragger).css({
				'left' : parseInt(options.rightPercent * ($(slide_container).width() - 2) / 100)
			})
		}

		initialize_slider_positions()

		/* Recalculate bounds during resizing events */
		const adjust_for_resizing = ()=>{
			slider_action()
			adjust_left_dragger()
			adjust_right_dragger()
			fill_right_obstacle()
			fill_left_obstacle()
			initialize_slider_positions()
			$(filler_containment_element).css({
				'left' : $(left_dragger).width(),
				'width' : $(slide_container).width() - $(left_dragger).width() - $(right_dragger).width()
			})
		}

		//Handle window resizing
		$(window).resize(()=>{
			adjust_for_resizing()
		})

		//Handle slide container resizing
		$(slide_container).resize(()=>{
			adjust_for_resizing()
		})

		const handle_filler_scroll = (direction)=>{
			switch(direction){
				case 'up':
					if($(filler).width() <= $(slide_container).width() - $(left_dragger).position().left - 4 && $(left_dragger).position().left > 1){
						$(filler).width($(filler).width() + 2)
						$(filler).css({
							left : $(filler).position().left - 1
						})
					}
					break
				case 'down':
					if($(filler).width() > 4){
						$(filler).width($(filler).width() - 2)
						$(filler).css({
							left: $(filler).position().left + 1
						})
					}
					break
				default:
					break
			}
			adjust_left_dragger()
			adjust_right_dragger()
			fill_right_obstacle()
			fill_left_obstacle()
			calculatePercentages()
		}

		//Scroll
		$(filler).bind('DOMMouseScroll', e=>{
		    if(e.originalEvent.detail > 0) {
		        handle_filler_scroll('up')
		    }else {
		        handle_filler_scroll('down')
	     	}
			//prevent page fom scrolling
		    return false
		})

		//IE, Opera, Safari
		$(filler).bind('mousewheel', e=>{
		    if(e.originalEvent.wheelDelta < 0) {
		        handle_filler_scroll('up')
		    }else {
		        handle_filler_scroll('down')
		    }

		    //prevent page fom scrolling
		    return false
		})

		//Initialize the slider positions
		slider_action()

		//Calculate the percentages and fire off the sliderMoved event once
		calculatePercentages()

	}
})
