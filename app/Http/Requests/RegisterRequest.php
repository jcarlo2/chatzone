<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
          'username' => 'required|unique:users',
          'password' => 'required|min:8|confirmed',
          'email' => 'required|unique:users',
          'firstName' => 'required',
          'lastName' => 'required',
          'gender' => 'required',
          'birthdate' => 'required|date|after_or_equal:1900-01-01',
        ];
    }
}
