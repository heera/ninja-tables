<style type="text/css">
<?php if($colors): ?>
    table<?php echo $css_prefix ?> {
        background-color: <?php echo $colors['bodyPrimaryColor'];?> !important;;
        color: <?php echo $colors['bodySecondaryColor'];?> !important;;
    }

    <?php echo $css_prefix ?> thead tr.footable-filtering th {
        background-color: <?php echo $colors['searchBarPrimaryColor']; ?> !important;
        color: <?php echo $colors['searchBarSecondaryColor']; ?> !important;
    }
    <?php echo $css_prefix ?> .input-group-btn:last-child > .btn:not(:last-child):not(.dropdown-toggle) {
         background-color: <?php echo $colors['searchBarSecondaryColor']; ?> !important;
         color: <?php echo $colors['searchBarPrimaryColor']; ?> !important;
    }
    <?php echo $css_prefix ?> tr.footable-header, <?php echo $css_prefix ?> tr.footable-header th {
        background-color: <?php echo $colors['headerPrimaryColor']; ?> !important;
        color: <?php echo $colors['headerSecondaryColor']; ?> !important;
    }
    
<?php endif; ?>
<?php echo $custom_css; ?>
</style> 