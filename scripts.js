/**
 * FutureMarket — shared scripts (Zurb Foundation 6)
 * Requires: jQuery, what-input, foundation-sites
 */
$(document).ready(function () {

  // Init all Foundation plugins (top-bar, dropdown-menu, responsive-toggle, abide, sticky)
  $(document).foundation();

  /* Close the mobile menu after tapping a nav link */
  $('#siteMenu a').on('click', function () {
    if ($('#navTitleBar').is(':visible')) {
      $('#navTitleBar').foundation('toggleMenu');
    }
  });

  /* Highlight the current page's nav link based on the filename */
  var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  $('#siteMenu a[href]').each(function () {
    var href = ($(this).attr('href') || '').toLowerCase();
    if (href === page || (page === '' && href === 'index.html')) {
      $(this).addClass('active');
    }
  });

  /* Contact / auth form UX feedback (no back end).
     Abide fires formvalid.zf.abide only when all constraints pass. */
  $('form[data-abide]')
    .on('formvalid.zf.abide', function (e, $form) {
      e.preventDefault();
      var $btn = $form.find('button[type=submit]');
      var original = $btn.html();
      $btn.html('<i class="bi bi-check-circle-fill"></i> Success!')
          .css('opacity', 0.85)
          .prop('disabled', true);
      setTimeout(function () {
        $btn.html(original).css('opacity', 1).prop('disabled', false);
        $form[0].reset();
      }, 2600);
    })
    .on('submit', function (e) {
      e.preventDefault(); // never actually navigate; demo only
    });

  /* Live password-match hint on the create-account page */
  var $pw = $('#password'), $pw2 = $('#confirmPassword');
  if ($pw.length && $pw2.length) {
    $pw2.on('input', function () {
      if ($pw2.val() && $pw2.val() === $pw.val()) {
        $pw2.css('border-color', 'var(--mint)');
      } else {
        $pw2.css('border-color', '');
      }
    });
  }

});
