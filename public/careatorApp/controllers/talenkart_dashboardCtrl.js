careatorApp.controller('talenkart_dashboardCtrl', function ($scope, $rootScope, $filter, $timeout, $window, careatorSessionAuth, careatorHttpFactory, SweetAlert) {
    console.log("talenkart_dashboardCtrl==>");
    $scope.clock = "loading clock..."; // initialise the time variable
 

    ///////////////Hamburger/////////////////////////
    $('#nav-icon1,#nav-icon2,#nav-icon3,#nav-icon4').click(function () {
        console.log("toggle click");
        $(this).toggleClass('open');
    });

  




    // ###################################################################################


    $scope.initializeJS = function () {

        //tool tips
        $('.tooltips').tooltip();

        //popovers
        $('.popovers').popover();

        //custom scrollbar
        //for html


        //sidebar dropdown menu
        $('#sidebar .sub-menu > a').click(function () {
            var last = $('.sub-menu.open', $('#sidebar'));
            $('.menu-arrow').removeClass('arrow_carrot-right');
            $('.sub', last).slideUp(200);
            var sub = $(this).next();
            if (sub.is(":visible")) {
                $('.menu-arrow').addClass('arrow_carrot-right');
                sub.slideUp(200);
            } else {
                $('.menu-arrow').addClass('arrow_carrot-down');
                sub.slideDown(200);
            }
            var o = ($(this).offset());
            diff = 200 - o.top;
            if (diff > 0)
                $("#sidebar").scrollTo("-=" + Math.abs(diff), 500);
            else
                $("#sidebar").scrollTo("+=" + Math.abs(diff), 500);
        });

        // sidebar menu toggle
        $(function () {
            function responsiveView() {
                var wSize = $(window).width();
                if (wSize <= 768) {
                    $('#container').addClass('sidebar-close');
                    $('#sidebar > ul').hide();
                    console.log("mobile view");
                    $('#profile').css({
                        'margin-top ': '195px'

                    });

                }

                if (wSize > 768) {
                    $('#container').removeClass('sidebar-close');
                    $('#sidebar > ul').show();
                    console.log("Desktop view");
                    $('#profile').css({
                        'margin-top ': '195px'
                    });


                }

            }
            $(window).on('load', responsiveView);
            $(window).on('resize', responsiveView);
        });
        $scope.menuclick = function () {
            if ($('#sidebar').is(":visible") === true) {
                $('#main-content').css({
                    'margin-left': '0px'
                });
                $('#sidebar').css({
                    'margin-left': '-180px'
                });
                $('#sidebar').hide();
                $("#container").addClass("sidebar-closed");
            } else {
                $('#main-content').css({
                    'margin-left': '180px'
                });
                $('#sidebar').show();
                $('#sidebar').css({
                    'margin-left': '0'
                });
                $("#container").removeClass("sidebar-closed");
            }


        }
        $('.toggle-nav').click(function () {
            if ($('#sidebar').is(":visible") === true) {
                $('#main-content').css({
                    'margin-left': '0px'
                });
                $('#sidebar').css({
                    'margin-left': '-180px'
                });
                $('#sidebar').hide();
                $("#container").addClass("sidebar-closed");
            } else {
                $('#main-content').css({
                    'margin-left': '180px'
                });
                $('#sidebar').show();
                $('#sidebar').css({
                    'margin-left': '0'
                });
                $("#container").removeClass("sidebar-closed");
            }


            // if (wSize <= 768) {
            //     $('#profile').css({
            //         'margin-top ': '195px'
            //     });

            // }
            // if (wSize > 768) {
            //     $('#profile').css({
            //         'margin-top ': ''
            //     });

            // }

            // if ($(window).width() <= 768){	
            //     $('#profile').css({
            //         'margin-top ': '195px'
            //     });


            // }
            // if ($('#sidebar > ul').is(":visible") === true) {
            //     $('#main-content').css({
            //         'margin-left': '0px'
            //     });
            //     $('#sidebar').css({
            //         'margin-left': '-180px'
            //     });
            //     $('#sidebar > ul').hide();
            //     $("#container").addClass("sidebar-closed");
            // } else {
            //     $('#main-content').css({
            //         'margin-left': '180px'
            //     });
            //     $('#sidebar > ul').show();
            //     $('#sidebar').css({
            //         'margin-left': '0'
            //     });
            //     $("#container").removeClass("sidebar-closed");
            // }
        });

        //bar chart
        if ($(".custom-custom-bar-chart")) {
            $(".bar").each(function () {
                var i = $(this).find(".value").html();
                $(this).find(".value").html("");
                $(this).find(".value").animate({
                    height: i
                }, 2000)
            })
        }

    }







    if (window.matchMedia('(min-width: 768px)').matches) {
        console.log("<<<<<<<home icon hide>>>>>>>");
        $("#sidebarmnu").css({
            "display": "none"
        })
        $("#sidebarmnudesktop").css({
            "margin-top": "4px"
        })

    }
    if (window.matchMedia('(max-width: 768px)').matches) {
        console.log("<<<<<<<home icon hide>>>>>>>");
        $("#sidebarmnudesktop").css({
            "display": "none"
        })
        $("#sidebarmnu").css({
            "margin-top": "50px"
        })
    }



  
})