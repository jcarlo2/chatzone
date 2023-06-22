<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ResetPassword extends Mailable
{
  use Queueable, SerializesModels;

  private $token;

  /**
   * Create a new message instance.
   */
  public function __construct($token)
  {
    $this->token = $token;
  }

  /**
   * Get the message envelope.
   */
  public function envelope(): Envelope
  {
    return new Envelope(
      subject: 'Reset Password',
    );
  }

  /**
   * Get the message content definition.
   */
  public function content(): Content
  {
    $img_url = public_path() . "/image/my-logo.png";
    return new Content(
      markdown: 'reset-password',
      with: [
        'token' => $this->token,
        'pathToImage' => $img_url
      ]
    );
  }

  /**
   * Get the attachments for the message.
   *
   * @return array<int, \Illuminate\Mail\Mailables\Attachment>
   */
  public function attachments(): array
  {
    return [];
  }
}
