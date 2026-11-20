from fastapi import HTTPException, status


class ClinicScribeException(HTTPException):
    """Base exception class for ClinicScribe."""
    def __init__(self, status_code: int, detail: str):
        super().__init__(status_code=status_code, detail=detail)


class TenantAccessDeniedException(ClinicScribeException):
    """Raised when an authenticated user attempts to access another clinic's data."""
    def __init__(self, detail: str = "Access denied for this clinic resource."):
        super().__init__(status_code=status.HTTP_403_FORBIDDEN, detail=detail)


class PatientConsentRequiredException(ClinicScribeException):
    """Raised when consultation recording or processing is attempted without verified consent."""
    def __init__(self, detail: str = "Patient consent record is mandatory before audio processing."):
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)


class ResourceNotFoundException(ClinicScribeException):
    """Raised when a requested resource is not found."""
    def __init__(self, resource: str, identifier: str):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{resource} with identifier '{identifier}' was not found.",
        )

