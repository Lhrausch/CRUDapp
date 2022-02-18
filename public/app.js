$(() => {
console.log("Jquery loaded");
$("img.carousel").eq(0).css("display", "block");

let num = 0;
let index = $("div.img-carousel").children().length-1;

$(".next").on("click", () => {
  $(".carousel").eq(num).fadeOut(250)
  $(".carousel").delay(250)
  console.log();
  if (num >= index) {
        num = 0;
    } else {
        num++;
    }
$(".carousel").eq(num).fadeIn(250)
});

$(".previous").on("click", () => {
  $(".carousel").eq(num).fadeOut(250)
  $(".carousel").delay(250)
  if (num <= 0) {
    num = index;
    } else {
        num--;
    }
  $(".carousel").eq(num).fadeIn(250)
});
})

