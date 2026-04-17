<?php

if ($_GET["text"] == "") {
    header("Location: ?text=[StartFromRecent][StartFromScratch]");
} else if (strtolower($_GET["text"]) == "startfromscratch") {
    $curr_number = 0;
    $steps = 1;
    setcookie("number_adder_curr_number", $curr_number, time() + 3600 * 24 * 30);
    setcookie("number_adder_steps", $steps, time() + 3600 * 24 * 30);
    header("Location: ?text=Number:$curr_number,Steps:$steps;[AddNumber][BuySteps]");
} else if (strtolower($_GET["text"]) == "startfromrecent") {
    $curr_number = $_COOKIE["number_adder_curr_number"] ?? 0;
    $steps = $_COOKIE["number_adder_steps"] ?? 1;
    header("Location: ?text=Number:$curr_number,Steps:$steps;[AddNumber][BuySteps]");
} else if (strtolower($_GET["text"]) == "addnumber") {
    setcookie("number_adder_returnto","homepage", time() + 3600 * 24 * 30);
    $curr_number = $_COOKIE["number_adder_curr_number"] ?? 0;
    $steps = $_COOKIE["number_adder_steps"] ?? 1;
    $curr_number += $steps;
    setcookie("number_adder_curr_number", $curr_number, time() + 3600 * 24 * 30);
    setcookie("number_adder_steps", $steps, time() + 3600 * 24 * 30);
    header("Location: ?text=Number:$curr_number,Steps:$steps;[AddNumber][BuySteps]");
} else if (strtolower($_GET["text"]) == "buysteps") {
    setcookie("number_adder_returnto","homepage", time() + 3600 * 24 * 30);
    header("Location: ?text=10numbers:1step[Buy<Steps:Interger>][Return]");
} else if (preg_match("/^[Bb]uy([123456789][0123456789]*)$/", $_GET["text"], $matches)) {
    $option = intval($matches[1]);
    $curr_number = $_COOKIE["number_adder_curr_number"] ?? 0;
    $steps = $_COOKIE["number_adder_steps"] ?? 1;
    if ($curr_number >= ($option * 10)) {
        $curr_number -= $option * 10;
        $steps += $option;
        setcookie("number_adder_curr_number", $curr_number, time() + 3600 * 24 * 30);
        setcookie("number_adder_steps", $steps, time() + 3600 * 24 * 30);
        setcookie("number_adder_returnto","store", time() + 3600 * 24 * 30);
        header("Location: ?text=Bought${option}steps|CurrentSteps:$steps;[Return]");
    } else {
        setcookie("number_adder_returnto","store", time() + 3600 * 24 * 30);
        header("Location: ?text=NotEnoughNumbers;[Return]");
    }
} else if (preg_match("/^[Bb]uy([0123456789\\.]*)$/", $_GET["text"], $matches)) {
    setcookie("number_adder_returnto","store", time() + 3600 * 24 * 30);
    header("Location: ?text=InvalidOption;[Return]");
} else if (strtolower($_GET["text"]) == "return") {
    $curr_number = $_COOKIE["number_adder_curr_number"] ?? 0;
    $steps = $_COOKIE["number_adder_steps"] ?? 1;
    if (($_COOKIE["number_adder_returnto"] ?? "homepage") == "store") {
        header("Location: ?text=BuySteps");
    } else {
        header("Location: ?text=Number:$curr_number,Steps:$steps;[AddNumber][BuySteps]");
    }
}
 
?>

<p>?text=xxxxx[operation1][operation2]</p>
<p>Replace to</p>
<p>?text=operation1 or ?text=operation2</p>
