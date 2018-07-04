$.fn.ZoomBarGraph = function(options){
	options = $.extend({}, $.fn.ZoomBarGraph.options, options)

	if(options.barBackgroundColor == null || options.barBackgroundColor == undefined){
		options.barBackgroundColor = 'linear-gradient(to right, #d87b7d,#a83835,#d87b7d)'
	}

	if(options.graphTitle == null || options.graphTitle == undefined){
		options.graphTitle = "Untitled Graph Yo"
	}

	const user_div = $(this)
	const container = null
	const draw_graph = ()=>{
		const title = $(document.createElement('div')).css({
			margin : 'auto',
			'font-weight' : 'bold',
			'font-size' : '20px',
			'width' : '100%',
			'text-align' : 'center'
		}).text(options.graphTitle)

		$(this).html(null)
		$(user_div).append(title)
		$(user_div).append($(document.createElement('br')))

		const container = $(document.createElement('div')).css({
			width: '100%',
			height: 400,
			'border' : '1px solid black',
			'overflow' : 'visible',
			'border-bottom-left-radius' : 10,
			'border-bottom-right-radius' : 10
		})

		$(container).html(null)
		$(user_div).append(container)

		const data = options.graphData

		let largest = 0
		data.forEach(date=>{
			if(date.val > largest){
				largest = date.val
			}
		})

		console.log(options.rangeFrom.format('M-D-Y'))
		console.log(options.rangeTo.format('M-D-Y'))
		const daysInBetween = options.rangeTo.diff(options.rangeFrom,'days')

		console.log("There are " + daysInBetween + " days in the range")
		
		const render_y_axis_step_guides = ()=>{
			const step_height = $(container).height() / largest
			for(let step = 1;step <  largest; step++){
				const current_step = $(document.createElement('div')).css({
					width : '100%',
					height: 1,
					'z-index' : 0,
					position: 'absolute',
					top: step * step_height,
					background: '#d6dada',
					left: 0
				})

				$(container).append(current_step)
			}
		}

		render_y_axis_step_guides()

		const left_offset = options.rangeFrom.diff(moment(data[0].date),'days')
		const right_offset = options.rangeTo.diff(moment(data[data.length - 1].date),'days')

		console.log(left_offset + " days from the beginning")
		console.log(right_offset + " days from the end")

		for(let day = 0; day < daysInBetween;day++){
			const dayLeft = day * ($(container).width() / daysInBetween)
			const dayTop = data[day + left_offset].val * ($(container).height() / largest) 
			
			const newBar = $(document.createElement('div')).css({
				width: '20px',
				background: options.barBackgroundColor,
				position: 'absolute',
				left: day * ($(container).width() / daysInBetween),
				height : dayTop,
				cursor : 'pointer',
				'border-bottom-right-radius' : 10,
				'border-bottom-left-radius' : 10
			})

			const date_tooltip = $(document.createElement('div')).css({
				width: $(newBar).width() - 10,
				'writing-mode' : 'vertical-rl',
				'text-orientation' : 'upright',
				'font-size' : '12px',
				display : 'none',
				'position' : 'absolute',
				'left': $(newBar).position().left,
				'top': -400,
				'transform' : 'rotateX(180deg)',
				'background' : 'white',
				'padding': 5,
				'text-align' : 'center',
				'border-top-right-radius' : '15px',
				'border-top-left-radius' : '15px',
				'border' : '1px solid black',
				'padding-left' : 9
			}).html(data[day + left_offset].date + "-<b>" + data[day + left_offset].val + "</b>")


			if($(newBar).height() > 150){
				$(date_tooltip).css({
					height: $(newBar).height() - 20
				})
			}else{
				$(date_tooltip).css({
					height: 150
				})
			}

			$(container).append(date_tooltip)

			$(newBar).hover(e=>{
				date_tooltip.css({
					display : 'block',
					left : $(newBar).position().left + 2,
					top : 0
				})
				$(newBar).css({
					border: '2px solid black'
				})
			}).mouseout(e=>{
				date_tooltip.css({
					display: 'none'
				})
				$(newBar).css({
					border : 'none'
				})
			})

			$(container).append(newBar)
		}

		$(container).css({
			'transform' : 'rotate(180deg)',
			'transform' : 'rotateX(180deg)'
		})
	}

	$(window).resize(e=>{
		draw_graph()
	})
	if(container != null){
		$(container).resize(e=>{
			draw_graph()
		})
	}

	draw_graph()
}