// Znajduje nadrzedny elemnt form dla wskazanego elementu
function findParentForm($element){
    if($element.tagName != "FORM"){
        $element =  findParentForm($element.parentElement);
    }

    return $element;
  }

  $(document).ready(function(){
    $forms = $("form");

    // Przekazywanie zawartości input'ow po zatwierdzeniu
    $($forms).each(function($i, $form){
      $($form).find('input[type="submit"], button[type="submit"]').on("click", function($e){
        $e.preventDefault();
        $form = findParentForm($e.target);

        $url = $($form).attr("action");
        $method = $($form).attr("method");
        $data = {};

        $($form).find("input, select").each(function($i, $input){
          $name = $($input).attr("id");
          if($($input).attr("type") == "checkbox"){
            $selected = $($input).is(":checked") ? 1 : 0;
            $data[$name] = $selected;
          } else {
            $data[$name] = $($input).val();
          }
        });

        // Notyfikacje & Przekierowanie
        $.ajax({
          url: $url,
          data: $data,
          type: $method,
        }).done(function(data){
          if(data['message']){
            notify(data);
            console.log(data);
          } else if (data['redirect']) {
            window.location = data['redirect'];
          } else {
            console.log(data);
          }
        }).fail(function($r){
          console.log($r.responseText);
        });

      })
    });

  });
