			var wall = new Freewall("#mosaico");
			wall.reset({
				selector: '.myimg',
				animate: true,
                guitterX: 0,
                guitterY: 0,
				cellW: 'auto',
				cellH: 'auto',
				onResize: function() {
					wall.fitWidth();
				}
			});

			var images = wall.container.find('.myimg');
			images.find('img').load(function() {
				wall.fitWidth();
			});
            wall.fitWidth();

