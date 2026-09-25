<?php
/**
 * NexUse — local configuration for this machine.
 *
 * Git-ignored. Copy `config.local.example.php` on a new machine and edit.
 */

return [
    'db_host' => '127.0.0.1',
    'db_port' => 3306,
    'db_name' => 'nexuse2',
    'db_user' => 'root',
    'db_pass' => '',

    // Outbound email.
    //   'log'  — write the message to storage/mail/ instead of sending (development)
    //   'mail' — hand it to PHP's mail(), which needs a working MTA
    // This machine has no mail server and no openssl extension, so TLS SMTP is
    // not possible; 'log' is the only driver that works here.
    'mail_driver'    => 'log',
    'mail_from'      => 'no-reply@nexuse.lk',
    'mail_from_name' => 'NexUse',

    'base_url' => '/NEXUSE2/NexUse_main-public-admin/public',
    'debug'    => true,
];
