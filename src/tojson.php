<?php
$fp = fopen('products.csv','r');
$i = 0;
while($line = fgets($fp,1024)) {
	// if($i < 1000) {
		$line = trim($line);
		list($k,$v) = explode(',',$line,2);
		$dat[$k] = $v;
	// }
	// $i++;
}
fclose($fp);
file_put_contents('products.json', json_encode($dat));
?>