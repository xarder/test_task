$(document).ready(function(){

    //возможные настройки для "модуля" могут быть расширены
    var globe_settings = {
        first_slide: 3,
        autoplay_interval:1500,
        autoplay:false
    };

    var box = function(){
        //свойства
    var
        settings = globe_settings,
        //флаг состояния блока (развернут\свернут)
        is_expanded=false,
        current_slide = settings.first_slide,
        slide_quantity,

        //dom elements
        $container = $('.box-content'),
        $slider_next = $('.box_slider_control.next'),
        $slider_prev = $('.box_slider_control.prev'),
        $action_btn = $('.box-btn.action a'),
        $slide_container = $container.find('.box-slide-container'),
        $expand_button = $container.find('.box_expand'),

        //main render method (get json data)
        render = function(){
            var $current_slide = current_slide;
            $.ajax({
                type: 'GET',
                url: '../js/info_box.json',
                dataType: 'JSON',
                success: function (rsp) {
                    slide_quantity = rsp.length;
                    for (var i=0;i<rsp.length;i+=1) {
                        //в JSON вместо слайда написано "филд" если это не ошибка, то проставил проверку на поле
                        var slide_active = '';
                        var img;
                        if (!rsp[i].img) {
                            img = rsp[i].field
                        } else {
                            img = rsp[i].img;
                        }

                        if ((i+1)==$current_slide){
                            slide_active = 'active';
                            $action_btn.attr('href',rsp[i].productUrl);
                        }

                        $slide_container.append(
                            '<div class="box-slide '+slide_active+'" data-slide="'+(i+1)+'" data-url="'+rsp[i].productUrl+'">'+
                            '<div class="box-slide-image">'+
                            '<img alt="" src="../images/'+img+'"/>'+
                            '</div>'+
                            '<div class="box-slide-info">'+
                            '<div class="box-slide-header">'+
                                rsp[i].title+
                            '</div>'+
                            '<div class="box-slide-description">'+
                                rsp[i].description+
                            '</div>'+
                            '<div class="box-slide-note">'+
                                rsp[i].note+
                            '</div>'+
                            '</div>'+
                            '</div>'
                        )

                    }
                }
            });
        },

        //методы
        expand = function(){
            $container.find('div.box-slide.active').find('div.box-slide-image').addClass('collapsed');
            $container.find('div.box-slide.active').find('div.box-slide-info').addClass('expanded');
            is_expanded=true;
        },

        collapse = function(){
            $container.find('div.box-slide.active').find('div.box-slide-image').removeClass('collapsed');
            $container.find('div.box-slide.active').find('div.box-slide-info').removeClass('expanded');
            is_expanded=false;
        },

        changeSlide = function(direction){
            if (direction == 'forward') {
                if (current_slide >= slide_quantity) {
                    current_slide = 1;
                } else {
                    current_slide+=1;
                }
            } else {
                if (current_slide == 1) {
                    current_slide = slide_quantity;
                } else {
                    current_slide-=1;
                }
            }

            collapse();
            $('.box-slide.active').removeClass('active');

            var $current_slide_elem = $('[data-slide="'+current_slide+'"]');
            $current_slide_elem.addClass('active');

            var url = $current_slide_elem.attr('data-url');
            $action_btn.attr('href',url);

        },

        autoplay = function(){
            if (settings.autoplay) {
                setInterval(function(){changeSlide('forward')},settings.autoplay_interval);
            }
        };


        $expand_button.on('click',function(){
            is_expanded ? collapse() : expand();
        });

        //разделил клики на некст и прев, для дальнейшей масштабируемости (к примеру, если только на некст клик, то что то делать)
        //а так можно было б по клику на "контрол" смотреть направление
        $slider_next.on('click',function(){
            changeSlide('forward');
        });

        $slider_prev.on('click',function(){
            changeSlide('backward');
        });

        render();
        autoplay();
    };

    box()

});